// trade-bot.js
import Binance from 'binance-api-node'
import dotenv from 'dotenv'

dotenv.config()

const client = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
  httpBase: process.env.NEXT_PUBLIC_BINANCE_API_URL
})

// Ejemplo de estrategia simple:
// Compra 0.001 BTC si el precio baja 1% respecto al último precio de cierre.
async function runBot() {
  try {
    const prices = await client.prices()
    const btcPrice = parseFloat(prices.BTCUSDT)
    const threshold = btcPrice * 0.99

    console.log('Precio BTC:', btcPrice, 'Umbral:', threshold)

    if (btcPrice < threshold) {
      const order = await client.order({
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'MARKET',
        quantity: 0.001
      })
      console.log('Orden ejecutada:', order.orderId)
    } else {
      console.log('Condición no cumplida, no se envía orden.')
    }
  } catch (err) {
    console.error('Error en runBot:', err.message)
  }
}

runBot()
