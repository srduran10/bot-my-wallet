import fs from 'fs'
import path from 'path'
import { client } from '../utils/binanceClient.js'

const historyPath = path.resolve('src/data/history.json')
const updatedHistory = []

async function evaluateTrade(entry) {
  const { symbol, entry: entryPrice, sl, tp, timestamp, outcome } = entry
  if (outcome && outcome !== 'pending') return entry

  try {
    const { price: currentPriceRaw } = await client.prices({ symbol })
    const currentPrice = parseFloat(currentPriceRaw)

    const result = (entry.side === 'BUY')
      ? (currentPrice >= tp ? 'win' : currentPrice <= sl ? 'loss' : 'pending')
      : (currentPrice <= tp ? 'win' : currentPrice >= sl ? 'loss' : 'pending')

    console.log(`🧠 ${symbol}: ${entry.side} | Entry: ${entryPrice} | Current: ${currentPrice} → ${result}`)
    return { ...entry, outcome: result }
  } catch (err) {
    console.error(`❌ Error en ${symbol}: ${err.message}`)
    return entry
  }
}

async function runOutcomeTracker() {
  if (!fs.existsSync(historyPath)) {
    console.error('❌ history.json no encontrado')
    return
  }

  const raw = JSON.parse(fs.readFileSync(historyPath))
  for (const entry of raw) {
    const updated = await evaluateTrade(entry)
    updatedHistory.push(updated)
  }

  fs.writeFileSync(historyPath, JSON.stringify(updatedHistory, null, 2))
  console.log('✅ history.json actualizado con resultados')
}

runOutcomeTracker()
