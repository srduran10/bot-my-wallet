import binance from '../utils/binanceClient.js'
import fs from 'fs'
import path from 'path'
import * as tf from '@tensorflow/tfjs-node'

const historyPath = path.resolve('src/data/history.json')
const modelPath = path.resolve('model/signalPredictor/model.json')

let model = null

async function loadModelIfAvailable() {
  if (!model && fs.existsSync(modelPath)) {
    try {
      model = await tf.loadLayersModel(`file://${modelPath}`)
      console.log('🧠 Modelo predictivo cargado correctamente')
    } catch (err) {
      console.warn('⚠️ Error al cargar el modelo, se usará señal simulada:', err.message)
    }
  }
}

function simulateIndicators() {
  const rsi = Math.floor(Math.random() * 40) + 30
  const macd = parseFloat((Math.random() * 2 - 1).toFixed(2))
  const sentimentValue = parseFloat((Math.random() * 100).toFixed(1))
  return { rsi, macd, sentimentValue }
}

function interpretSentiment(value) {
  return value > 70 ? 'Greedy'
       : value < 55 ? 'Fear'
       : 'Neutral'
}

function estimateOutcome(score) {
  return score > 0.65 ? 'win'
       : score < 0.5  ? 'loss'
       : 'pending'
}

export async function evaluateSignal(symbol) {
  try {
    await loadModelIfAvailable()

    const prices = await binance.prices(symbol)
    const price = parseFloat(prices[symbol])

    const { rsi, macd, sentimentValue } = simulateIndicators()

    let prediction = Math.random() // fallback si no hay modelo
    if (model) {
      const input = tf.tensor2d([[rsi, macd, sentimentValue]])
      const output = model.predict(input)
      const result = await output.data()
      prediction = result[0]
    }

    const sentimentLabel = interpretSentiment(sentimentValue)
    const outcome = estimateOutcome(prediction)

    const signal = {
      timestamp: Date.now(),
      symbol,
      price,
      rsi,
      macd,
      sentiment: {
        label: sentimentLabel,
        value: sentimentValue
      },
      prediction: parseFloat((prediction * 100).toFixed(1)),
      outcome
    }

    const history = fs.existsSync(historyPath)
      ? JSON.parse(fs.readFileSync(historyPath))
      : []

    history.push(signal)
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2))

    console.log(`📍 Señal registrada: ${symbol} — ${outcome.toUpperCase()} (${signal.prediction}%)`)

    return signal

  } catch (error) {
    console.error(`❌ Error al generar señal para ${symbol}:`, error.message)
    return null
  }
}