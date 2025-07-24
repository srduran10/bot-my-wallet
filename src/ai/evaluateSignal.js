import * as tf from '@tensorflow/tfjs-node'

/**
 * Simula una evaluación de señal antes de ejecutar orden
 * Puedes integrarlo dentro de tu estrategia o dashboard
 */

async function loadModel(path = 'model/signalPredictor') {
  try {
    const model = await tf.loadLayersModel(`file://${path}/model.json`)
    return model
  } catch (err) {
    console.error(`❌ Modelo no encontrado en ${path}`)
    return null
  }
}

async function evaluate({ rsi, macd, sentiment }) {
  const model = await loadModel()
  if (!model) return

  const input = tf.tensor2d([[rsi, macd, sentiment]])
  const prediction = model.predict(input)
  const result = await prediction.data()
  const probability = (result[0] * 100).toFixed(2)

  console.log(`🤖 Señal evaluada: RSI ${rsi}, MACD ${macd}, Sentimiento ${sentiment}`)
  console.log(`🔍 Probabilidad de éxito estimada: ${probability}%`)
}

const signalSample = {
  rsi: 77.5,
  macd: 0.02,
  sentiment: 26 // Fear
}

evaluate(signalSample)
