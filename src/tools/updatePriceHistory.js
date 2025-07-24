// Ejecuta este script manualmente con: node src/data/updatePriceHistory.js
// O automáticamente cada 12 horas vía cron (instrucción abajo)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { client } from '../utils/binanceClient.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 🪙 Activos a actualizar
const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'MATICUSDT']
const interval = '1h'
const limit = 50

async function updateHistoryForSymbol(symbol) {
  try {
    console.log(`🔄 Descargando datos de ${symbol}...`)
    const candles = await client.candles({ symbol, interval, limit })

    const history = candles.map(c => ({
      timestamp: c.closeTime,
      close: parseFloat(c.close)
    }))

    const filePath = path.join(__dirname, `${symbol}_priceHistory.json`)
    fs.writeFileSync(filePath, JSON.stringify(history, null, 2))
    console.log(`✅ ${symbol} actualizado: ${history.length} registros`)
  } catch (err) {
    console.error(`❌ Error en ${symbol}: ${err.message}`)
  }
}

async function updateAll() {
  console.log('\n📦 Iniciando actualización de activos...\n')
  for (const symbol of symbols) {
    await updateHistoryForSymbol(symbol)
  }
  console.log('\n🧠 Actualización completada\n')
}

updateAll()
