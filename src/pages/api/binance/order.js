import Binance from 'binance-api-node'
import Cors from 'cors'

// Configura CORS para permitir solo tu frontend
const cors = Cors({ methods: ['POST'] })
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) =>
      result instanceof Error ? reject(result) : resolve(result)
    )
  })
}

const client = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
  httpBase: process.env.NEXT_PUBLIC_BINANCE_API_URL
})

export default async function handler(req, res) {
  await runMiddleware(req, res, cors)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { symbol, side, type, quantity, price } = req.body
  try {
    const order = await client.order({
      symbol: symbol.toUpperCase(), 
      side,                   // 'BUY' o 'SELL'
      type,                   // 'MARKET', 'LIMIT', etc.
      quantity,
      ...(type === 'LIMIT' && { price })
    })
    return res.status(200).json({ success: true, order })
  } catch (error) {
    console.error('Order error:', error)
    return res.status(500).json({ success: false, message: error.message })
  }
}
