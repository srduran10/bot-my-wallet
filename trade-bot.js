import 'dotenv/config'
import fs from 'fs'
import path from 'path'

import { client } from './src/clients/binanceClient.js'
import { monitorPositions } from './src/core/positionManager.js'
import { getPortfolio } from './src/core/portfolioManager.js'
import { updateWallet, getWallet } from './src/core/walletManager.js'
import {
  calculateRiskLevels,
  getRiskProfile,
  shouldExecuteTrade,
  getExecutionNotes
} from './src/core/riskManager.js'

import evaluateSignal from './src/ai/evaluateSignal.js'
import { autoAdjustStrategy } from './src/strategy/autoAdjustStrategy.js'
import { botConfig } from './runtime/config.js'
import { logEntry } from './src/utils/logger.js'
import { getMarketSentiment } from './src/context/fearGreedIndex.js'
import { logNarrative } from './src/logs/operationLogger.js'

async function definePortfolio() {
  const portfolio = []

  for (const symbol of botConfig.symbols) {
    const prices = await client.prices(symbol)
    const currentPrice = parseFloat(prices[symbol])
    const quantity = (
      botConfig.tradeAmount / currentPrice
    ).toFixed(botConfig.quantityPrecision?.[symbol] || 6)

    const rsi = null
    const macd = null
    const emaSignal = null

    portfolio.push({ symbol, decision: 'BUY', quantity, rsi, macd, emaSignal })
  }

  return portfolio
}

function saveToHistory(order, extras = {}) {
  const filePath = path.resolve('src/data/history.json')
  const history = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : []

  history.push({
    timestamp: new Date().toISOString(),
    symbol: order.symbol,
    side: order.side,
    price: order.fills?.[0]?.price || order.price,
    quantity: order.origQty || order.executedQty,
    orderId: order.orderId,
    type: order.type || extras.type || 'MARKET',
    ...extras
  })

  fs.writeFileSync(filePath, JSON.stringify(history, null, 2))
  logEntry(`✅ Operación en ${order.symbol} registrada`)
}

async function runBot() {
  try {
    logEntry('🚦 Inicio de ejecución automática')

    if (botConfig.mode === 'simulation') {
      logEntry('🧪 Modo simulación activo — no se ejecutarán órdenes reales')
    }

    await monitorPositions()
    logEntry('🔍 Posiciones activas monitoreadas')

    const walletState = getWallet()
    const profile = getRiskProfile(walletState.current)
    logEntry(`🎯 Perfil: ${profile} — ${getExecutionNotes(profile)}`)

    const sentiment = await getMarketSentiment()
    logEntry(`🌡️ Fear & Greed Index: ${sentiment.value}`)

    const currentPortfolio = getPortfolio()
    logEntry(`📋 Portafolio actual: ${currentPortfolio.positions.length} posiciones abiertas`)

    const portfolio = await definePortfolio()
    logEntry(`📋 Candidatos de trading: ${portfolio.length} activos`)

    if (!portfolio.length) {
      logEntry('⛔ Ciclo finalizado sin señales de entrada')
      return
    }

    for (const { symbol, decision, quantity, rsi, macd, emaSignal } of portfolio) {
      const probability = await evaluateSignal({ rsi, macd, sentiment: sentiment.value })

      if (!shouldExecuteTrade(profile, probability)) {
        logEntry(`⚠️ Señal descartada en ${symbol}. Probabilidad: ${probability}%`)
        logNarrative({ symbol, outcome: 'neutral', probability, capitalUsed: 0, pnl: 0 })
        continue
      }

      const strategy = autoAdjustStrategy(symbol, rsi, macd)
      logEntry(`🧠 Estrategia: TP ${strategy.tpPercent}%, SL ${strategy.slPercent}%`)

      if (botConfig.mode !== 'simulation') {
        const marketOrder = await client.order({
          symbol,
          side: decision,
          type: 'MARKET',
          quantity
        })

        saveToHistory(marketOrder, {
          type: 'MARKET', rsi, macd, emaSignal,
          sentiment, strategySnapshot: strategy, outcome: 'pending'
        })

        const entryPrice = parseFloat(marketOrder.fills?.[0]?.price || marketOrder.price)
        const { stopLoss, takeProfit } = calculateRiskLevels(
          entryPrice, decision, strategy.slPercent, strategy.tpPercent
        )
        logEntry(`🛡️ SL: ${stopLoss.toFixed(2)} | TP: ${takeProfit.toFixed(2)} en ${symbol}`)

        const ocoOrder = await client.orderOco({
          symbol,
          side: decision === 'BUY' ? 'SELL' : 'BUY',
          quantity,
          price: takeProfit.toFixed(2),
          stopPrice: stopLoss.toFixed(2),
          stopLimitPrice: stopLoss.toFixed(2),
          stopLimitTimeInForce: 'GTC'
        })

        saveToHistory(ocoOrder.orderReports?.[0], {
          type: 'OCO', entry: entryPrice, sl: stopLoss, tp: takeProfit
        })

        logEntry(`⚔️ OCO confirmado en ${symbol}`)

        logNarrative({
          symbol, outcome: 'pending',
          probability, capitalUsed: parseFloat(quantity), pnl: 0
        })
      } else {
        logEntry(`🛑 Simulación: no se ejecutó orden real en ${symbol}`)
      }
    }

    const pnl = 0
    updateWallet(pnl)
    const wallet = getWallet()
    logEntry(`💼 Balance actualizado: $${wallet.current.toFixed(2)}`)
  } catch (err) {
    logEntry(`❌ Error detectado: ${err.message}`)
    console.error('⛔ Error en runBot():', err)
  }
}

runBot()
setInterval(runBot, botConfig.executionInterval * 60 * 1000)