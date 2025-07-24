import Binance from 'node-binance-api';
import dotenv from 'dotenv';
dotenv.config();

// 🧪 Selección de entorno
const useTestnet = process.env.USE_TESTNET === 'true';

export const client = new Binance().options({
  APIKEY: useTestnet ? process.env.TESTNET_API_KEY : process.env.MAINNET_API_KEY,
  APISECRET: useTestnet ? process.env.TESTNET_API_SECRET : process.env.MAINNET_API_SECRET,
  test: useTestnet,
  urls: useTestnet
    ? { base: 'https://testnet.binance.vision/api/' }
    : { base: 'https://api.binance.com/api/' }
});

// 🔍 Diagnóstico rápido de conexión
export async function pingBinance() {
  try {
    const result = await client.ping();
    console.log('🟢 Binance conectado correctamente:', result);
  } catch (err) {
    console.error('🔴 Error al conectar con Binance:', err.message);
  }
}