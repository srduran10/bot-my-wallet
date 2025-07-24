"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
exports.pingBinance = pingBinance;
const node_binance_api_1 = __importDefault(require("node-binance-api"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 🧪 Selección de entorno
const useTestnet = process.env.USE_TESTNET === 'true';
exports.client = new node_binance_api_1.default().options({
    APIKEY: useTestnet ? process.env.TESTNET_API_KEY : process.env.MAINNET_API_KEY,
    APISECRET: useTestnet ? process.env.TESTNET_API_SECRET : process.env.MAINNET_API_SECRET,
    test: useTestnet,
    urls: useTestnet
        ? { base: 'https://testnet.binance.vision/api/' }
        : { base: 'https://api.binance.com/api/' }
});
// 🔍 Diagnóstico rápido de conexión
async function pingBinance() {
    try {
        const result = await exports.client.ping();
        console.log('🟢 Binance conectado correctamente:', result);
    }
    catch (err) {
        console.error('🔴 Error al conectar con Binance:', err.message);
    }
}
