import Binance from 'binance-api-node';

const client = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
  httpBase: process.env.NEXT_PUBLIC_BINANCE_API_URL
});

export default async function handler(req, res) {
  try {
    const time = await client.time();
    return res.status(200).json({ success: true, serverTime: time.serverTime });
  } catch (err) {
    console.error('Ping error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
