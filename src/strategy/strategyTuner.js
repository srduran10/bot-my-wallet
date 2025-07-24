import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { calculateRSI } from './indicators/rsi.js'
import { calculateMACD } from './indicators/macd.js'
import { getEMASignal } from './indicators/emaReversal.js'
import { getMarketSentiment } from '../context/fearGreedIndex.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 🧬 Simula precios o carga precios reales
const precios = [
  29650, 29680, 29710, 29750, 29720, 29690, 29730, 29770,
  29740, 29780, 29820, 29800, 29860, 29890, 29920, 29900,
  29940, 29910, 29880, 29900, 29950, 29980, 30010, 29990,
  30040, 30070, 30030, 29990, 29960, 29980, 30000, 30030
]

// 🔎 Indicadores técnicos
const rsi = calculateRSI(precios)
const macd = calculateMACD(precios)
const emaSignal = getEMASignal(precios)

// 🔎 Volatilidad tipo ATR simplificado
function calculateVolatility(prices) {
  const diffs = prices.map((p, i) => i > 0 ? Math.abs(p - prices[i - 1]) : 0)
  return diffs.reduce((a, b) => a + b, 0) / (prices.length - 1)
}
const atr = calculateVolatility(precios)

// 🔎 Sentimiento de mercado
const sentiment = await getMarketSentiment()

// 🎯 Diagnóstico automatizado
let estrategia = ''
if (rsi < 30 && emaSignal === 'bullish') {
  estrategia = '📈 Reversión desde sobreventa. Entrada conservadora sugerida.'
} else if (rsi > 70 && emaSignal === 'bearish') {
  estrategia = '📉 Sobrecompra + cruce bajista. Toma de ganancias recomendada.'
} else if (macd > 0 && emaSignal === 'bullish') {
  estrategia = '🟢 Momentum positivo. Entrada moderada viable.'
} else if (sentiment.classification === 'Extreme Greed') {
  estrategia = '🔥 Euforia colectiva. Evaluar riesgo de reversión antes de operar.'
} else {
  estrategia = '🕊️ Zona ambigua. Esperar confirmaciones dobles.'
}

// 📊 Mostrar diagnóstico en consola
console.log('\n🧠 Diagnóstico BotMyWallet v2\n')
console.log(`📌 RSI: ${rsi.toFixed(2)} (${rsi < 30 ? 'Sobrevendido' : rsi > 70 ? 'Sobrecomprado' : 'Neutral'})`)
console.log(`📌 MACD: ${macd.toFixed(2)} (${macd >= 0 ? 'Alcista' : 'Bajista'})`)
console.log(`📌 EMA Signal: ${emaSignal}`)
console.log(`📌 Sentimiento: ${sentiment.classification} (${sentiment.value})`)
console.log(`📌 Volatilidad (ATR): ${atr.toFixed(2)}`)
console.log(`\n🎯 Recomendación:\n${estrategia}\n`)

// 🧾 Exportar a JSON
const report = {
  timestamp: new Date().toISOString(),
  rsi: rsi.toFixed(2),
  macd: macd.toFixed(2),
  emaSignal,
  atr: atr.toFixed(2),
  sentiment: sentiment,
  estrategia
}
const reportPath = path.join(__dirname, '../data/diagnosticReport.json')
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
console.log(`✅ Informe guardado en diagnosticReport.json`)