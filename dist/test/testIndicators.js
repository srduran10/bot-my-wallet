"use strict";
// src/test/testIndicators.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = require("node:url");
const rsi_js_1 = require("../strategy/indicators/rsi.js");
const macd_js_1 = require("../strategy/indicators/macd.js");
const emaReversal_js_1 = require("../strategy/indicators/emaReversal.js");
const fearGreedIndex_js_1 = require("../context/fearGreedIndex.js");
const __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
const __dirname = node_path_1.default.dirname(__filename);
// Cargar historial de precios desde JSON
const filePath = node_path_1.default.join(__dirname, '../data/priceHistory.json');
const rawData = node_fs_1.default.readFileSync(filePath, 'utf-8');
const history = JSON.parse(rawData);
const prices = history.map((entry) => entry.close).slice(-50);
// Calcular indicadores
const rsi = (0, rsi_js_1.calculateRSI)(prices);
const macd = (0, macd_js_1.calculateMACD)(prices);
const emaSignal = (0, emaReversal_js_1.getEMASignal)(prices);
const atr = prices.reduce((acc, val, i, arr) => i > 0 ? acc + Math.abs(val - arr[i - 1]) : acc, 0) / prices.length;
const sentiment = await (0, fearGreedIndex_js_1.getMarketSentiment)();
// Mostrar diagnóstico
console.log('\n📊 Diagnóstico Técnico Automático\n');
console.log(`📌 RSI: ${rsi.toFixed(2)} (${rsi < 30 ? 'Sobrevendido' : rsi > 70 ? 'Sobrecomprado' : 'Neutral'})`);
console.log(`📌 MACD: ${macd.toFixed(2)} (${macd >= 0 ? 'Alcista' : 'Bajista'})`);
console.log(`📌 EMA Signal: ${emaSignal}`);
console.log(`📌 Volatilidad (ATR): ${atr.toFixed(2)}`);
console.log(`📌 Sentimiento: ${sentiment.classification} (${sentiment.value})`);
console.log(`\n🎯 Recomendación:`);
if (rsi < 30 && emaSignal === 'bullish') {
    console.log('📈 Posible rebote técnico. Entrada conservadora sugerida.');
}
else if (rsi > 70 && emaSignal === 'bearish') {
    console.log('📉 Riesgo de corrección. Considera proteger posiciones.');
}
else {
    console.log('🕊️ Mercado en zona neutra. Esperar confirmaciones dobles.');
}
