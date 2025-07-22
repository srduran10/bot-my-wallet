import Binance from 'binance-api-node'
import fs from 'fs'
import path from 'path'

// Inicializa el cliente con claves del entorno
const client = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET
})

// Configuración básica del bot
const symbol = 'BTCUSDT'
const quantity = '0.001'

// Función principal
async function runBot() {
  try {
    const { price } = await client.prices({ symbol })
    const currentPrice = parseFloat(price)
    console.log(`Precio actual de ${symbol}:

{currentPrice}`)

    // Reglas simples de ejemplo
    const buyThreshold = 60000
    const sellThreshold = 65000

    let order = null
    if (currentPrice < buyThreshold) {
      order = await client.order({
        symbol,
        side: 'BUY',
        type: 'MARKET',
        quantity
      })
      console.log(`Orden de COMPRA ejecutada a 

{currentPrice}`)
    } else if (currentPrice > sellThreshold) {
      order = await client.order({
        symbol,
        side: 'SELL',
        type: 'MARKET',
        quantity
      })
      console.log(`Orden de VENTA ejecutada a $${currentPrice}`)
    } else {
      console.log('Sin condiciones de compra/venta. Manteniendo posición.')
    }

    // Guardar en historial
    if (order) {
      const file = path.resolve('data/history.json')
      const raw = fs.readFileSync(file, 'utf8')
      const history = JSON.parse(raw)

      history.push({
        timestamp: new Date().toISOString(),
        symbol: order.symbol,
        side: order.side,
        price: order.fills?.[0]?.price || order.price,
        quantity: order.origQty || order.executedQty,
        orderId: order.orderId
      })

      fs.writeFileSync(file, JSON.stringify(history, null, 2))
      console.log('✅ Operación registrada en history.json')
    }

  } catch (error) {
    console.error('❌ Error ejecutando el bot:', error.message)
    process.exit(1)
  }
}

// Ejecutar
runBot()
