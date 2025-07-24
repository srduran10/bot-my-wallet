// src/test/testIndicators.js

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { calculateRSI } from '../strategy/indicators/rsi.js'
import { calculateMACD } from '../strategy/indicators/macd.js'
import { getEMASignal } from '../strategy/indicators/emaReversal.js'
import { getMarketSentiment } from '../context/fearGreedIndex.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cargar historial de precios desde JSON
const filePath = path.join(__dirname, '../data/priceHistory.json')
const rawData = fs.readFileSync(filePath, 'utf-8')
const history = JSON.parse(rawData)
const prices = history.map((entry) => entry.close).slice(-50)

// Calcular indicadores
const rsi = calculateRSI(prices)
const macd = calculateMACD(prices)
const emaSignal = getEMASignal(prices)
const atr = prices.reduce((acc, val, i, arr) => i > 0 ? acc + Math.abs(val - arr[i - 1]) : acc, 0) / prices.length
const sentiment = await getMarketSentiment()

// Mostrar diagnóstico
console.log('\n📊 Diagnóstico Técnico Automático\n')
console.log(`📌 RSI: ${rsi.toFixed(2)} (${rsi < 30 ? 'Sobrevendido' : rsi > 70 ? 'Sobrecomprado' : 'Neutral'})`)
console.log(`📌 MACD: ${macd.toFixed(2)} (${macd >= 0 ? 'Alcista' : 'Bajista'})`)
console.log(`📌 EMA Signal: ${emaSignal}`)
console.log(`📌 Volatilidad (ATR): ${atr.toFixed(2)}`)
console.log(`📌 Sentimiento: ${sentiment.classification} (${sentiment.value})`)

console.log(`\n🎯 Recomendación:`)
if (rsi < 30 && emaSignal === 'bullish') {
  console.log('📈 Posible rebote técnico. Entrada conservadora sugerida.')
} else if (rsi > 70 && emaSignal === 'bearish') {
  console.log('📉 Riesgo de corrección. Considera proteger posiciones.')
} else {
  console.log('🕊️ Mercado en zona neutra. Esperar confirmaciones dobles.')
}