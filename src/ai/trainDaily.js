/**
 * Entrenamiento diario de modelo supervisado con TensorFlow.js
 * Entrena sobre history.json y guarda el modelo en model/signalPredictor
 */

import fs from 'fs'
import path from 'path'
import * as tf from '@tensorflow/tfjs-node'

const historyPath = path.resolve('src/data/history.json')
const modelPath   = path.resolve('model/signalPredictor')

function loadHistoryData() {
  if (!fs.existsSync(historyPath)) return []

  const rawData = JSON.parse(fs.readFileSync(historyPath))
  return rawData
    .filter(e =>
      typeof e.rsi === 'number' &&
      typeof e.macd === 'number' &&
      e.sentiment &&
      typeof e.sentiment.value === 'number' &&
      (e.outcome === 'win' || e.outcome === 'loss')
    )
    .map(e => ({
      rsi: e.rsi,
      macd: e.macd,
      sentiment: e.sentiment.value,
      result: e.outcome === 'win' ? 1 : 0
    }))
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

  await model.fit(xs, ys, { epochs: 100, batchSize: 16, verbose: 0 })
  await model.save(`file://${modelPath}`)
}

async function runDailyTraining() {
  const dataset = loadHistoryData()
  if (dataset.length < 20) {
    console.warn('⚠️ No hay suficientes datos para entrenamiento (mínimo 20)')
    return
  }

  const model = createModel()
  await trainModel(model, dataset)
  console.log(`✅ Modelo reentrenado y guardado en ${modelPath}`)
}

runDailyTraining()
