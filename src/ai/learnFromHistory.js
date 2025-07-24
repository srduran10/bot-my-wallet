/**
 * Entrenamiento supervisado básico en Node.js con TensorFlow.js
 * Analiza RSI, MACD, Sentimiento y resultado para predecir efectividad de futuras señales
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as tf from '@tensorflow/tfjs-node'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const historyPath = path.join(__dirname, '../data/history.json')

function loadHistoryData() {
  if (!fs.existsSync(historyPath)) {
    console.error('❌ No se encontró history.json')
    process.exit(1)
  }
  const rawData = JSON.parse(fs.readFileSync(historyPath))
  const dataset = []

  for (const entry of rawData) {
    if (!entry.rsi || !entry.macd || !entry.sentiment || !entry.outcome) continue

    dataset.push({
      rsi: entry.rsi,
      macd: entry.macd,
      sentiment: entry.sentiment.value, // numérico
      result: entry.outcome === 'win' ? 1 : 0
    })
  }

  return dataset
}

function createModel() {
  const model = tf.sequential()
  model.add(tf.layers.dense({ units: 8, inputShape: [3], activation: 'relu' }))
  model.add(tf.layers.dense({ units: 4, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }))
  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] })
  return model
}

async function trainModel(model, dataset) {
  const inputs = dataset.map(d => [d.rsi, d.macd, d.sentiment])
  const labels = dataset.map(d => d.result)

  const xs = tf.tensor2d(inputs)
  const ys = tf.tensor2d(labels, [labels.length, 1])

  await model.fit(xs, ys, {
    epochs: 100,
    batchSize: 16,
    verbose: 0
  })

  console.log('✅ Entrenamiento completado')
}

async function run() {
  const dataset = loadHistoryData()
  if (dataset.length < 20) {
    console.error('⚠️ No hay suficientes ejemplos para entrenar (mínimo 20)')
    return
  }

  const model = createModel()
  await trainModel(model, dataset)

  // Prueba de predicción
  const sample = tf.tensor2d([[72, -0.3, 22]]) // RSI alto, MACD bajista, Sentimiento Fear
  const prediction = model.predict(sample)
  const confidence = await prediction.data()
  console.log(`🤖 Probabilidad estimada de éxito: ${(confidence[0] * 100).toFixed(2)}%`)
}

run()
