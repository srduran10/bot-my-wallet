import { getClosingPrices } from './src/data/priceHistory.js'
import { getTradingDecision } from './src/strategy/fearAwareEmaReversal.js'

const symbols = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'SOLUSDT',
  'OMNIUSDT',
  'CUSDT',
  'REZUSDT',
  'DOGEUSDT'
]

const interval = '1h'
const candleLimit = 200

async function simulateOnSymbol(symbol) {
  const prices = await getClosingPrices(symbol, interval, candleLimit)
  if (prices.length < 60) {
    console.warn(`⚠️ ${symbol}: No hay suficientes datos (${prices.length} velas)`)
    return null
  }

  let correct = 0
  let total = 0

  for (let i = 50; i < prices.length - 1; i++) {
    const slice = prices.slice(i - 50, i)
    const decision = await getTradingDecision(slice)
    const current = prices[i]
    const next = prices[i + 1]

    const wentUp = next > current
    const wentDown = next < current

    let match = false
    if (decision === 'BUY' && wentUp) match = true
    if (decision === 'SELL' && wentDown) match = true

    if (decision !== 'HOLD') {
      total++
      if (match) correct++
    }
  }

  const accuracy = total ? ((correct / total) * 100).toFixed(2) : '0.00'
  return { symbol, total, correct, accuracy }
}

async function runSimulation() {
  const results = []

  for (const symbol of symbols) {
    console.log(`📊 Simulando sobre ${symbol}...`)
    const result = await simulateOnSymbol(symbol)
    if (result) results.push(result)
  }

  console.log('\n📈 Resultado por activo:')
  results.forEach(r => {
    console.log(`- ${r.symbol}: Precisión ${r.accuracy}% (${r.correct}/${r.total} señales acertadas)`)
  })

  const globalTotal = results.reduce((sum, r) => sum + r.total, 0)
  const globalCorrect = results.reduce((sum, r) => sum + r.correct, 0)
  const globalAccuracy = globalTotal ? ((globalCorrect / globalTotal) * 100).toFixed(2) : '0.00'

  console.log(`\n🧠 Precisión global: ${globalAccuracy}% en ${globalTotal} señales`)
}

runSimulation()
