/**
 * Ajusta parámetros técnicos según historial de resultados
 * Requiere acceso a history.json con campos: symbol, rsi, macd, outcome
 */

import fs from 'fs'
import path from 'path'

const historyPath = path.resolve('src/data/history.json')

export function autoAdjustStrategy(symbol, rsi, macd) {
  if (!fs.existsSync(historyPath)) return { slPercent: 2, tpPercent: 3 }

  const rawData = JSON.parse(fs.readFileSync(historyPath))
  const recentTrades = rawData.filter(entry =>
    entry.symbol === symbol &&
    entry.outcome &&
    typeof entry.rsi === 'number' &&
    typeof entry.macd === 'number'
  ).slice(-20)

  const winRate = recentTrades.filter(t => t.outcome === 'win').length / recentTrades.length || 0

  let slPercent = 2
  let tpPercent = 3
  let confirmation = 'dual'

  if (winRate < 0.5) {
    slPercent += 0.5
    tpPercent -= 0.5
    confirmation = 'triple'
  }

  if (rsi > 75 && winRate < 0.3) {
    confirmation = 'strict'
    tpPercent = 2
  }

  return { slPercent, tpPercent, confirmation, winRate: +(winRate * 100).toFixed(1) }
}
