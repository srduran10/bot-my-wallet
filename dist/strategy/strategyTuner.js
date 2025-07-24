"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = require("node:url");
const rsi_js_1 = require("./indicators/rsi.js");
const macd_js_1 = require("./indicators/macd.js");
const emaReversal_js_1 = require("./indicators/emaReversal.js");
const fearGreedIndex_js_1 = require("../context/fearGreedIndex.js");
const __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
const __dirname = node_path_1.default.dirname(__filename);
// 🧬 Simula precios o carga precios reales
const precios = [
    29650, 29680, 29710, 29750, 29720, 29690, 29730, 29770,
    29740, 29780, 29820, 29800, 29860, 29890, 29920, 29900,
    29940, 29910, 29880, 29900, 29950, 29980, 30010, 29990,
    30040, 30070, 30030, 29990, 29960, 29980, 30000, 30030
];
// 🔎 Indicadores técnicos
const rsi = (0, rsi_js_1.calculateRSI)(precios);
const macd = (0, macd_js_1.calculateMACD)(precios);
const emaSignal = (0, emaReversal_js_1.getEMASignal)(precios);
// 🔎 Volatilidad tipo ATR simplificado
function calculateVolatility(prices) {
    const diffs = prices.map((p, i) => i > 0 ? Math.abs(p - prices[i - 1]) : 0);
    return diffs.reduce((a, b) => a + b, 0) / (prices.length - 1);
}
const atr = calculateVolatility(precios);
// 🔎 Sentimiento de mercado
const sentiment = await (0, fearGreedIndex_js_1.getMarketSentiment)();
// 🎯 Diagnóstico automatizado
let estrategia = '';
if (rsi < 30 && emaSignal === 'bullish') {
    estrategia = '📈 Reversión desde sobreventa. Entrada conservadora sugerida.';
}
else if (rsi > 70 && emaSignal === 'bearish') {
    estrategia = '📉 Sobrecompra + cruce bajista. Toma de ganancias recomendada.';
}
else if (macd > 0 && emaSignal === 'bullish') {
    estrategia = '🟢 Momentum positivo. Entrada moderada viable.';
}
else if (sentiment.classification === 'Extreme Greed') {
    estrategia = '🔥 Euforia colectiva. Evaluar riesgo de reversión antes de operar.';
}
else {
    estrategia = '🕊️ Zona ambigua. Esperar confirmaciones dobles.';
}
// 📊 Mostrar diagnóstico en consola
console.log('\n🧠 Diagnóstico BotMyWallet v2\n');
console.log(`📌 RSI: ${rsi.toFixed(2)} (${rsi < 30 ? 'Sobrevendido' : rsi > 70 ? 'Sobrecomprado' : 'Neutral'})`);
console.log(`📌 MACD: ${macd.toFixed(2)} (${macd >= 0 ? 'Alcista' : 'Bajista'})`);
console.log(`📌 EMA Signal: ${emaSignal}`);
console.log(`📌 Sentimiento: ${sentiment.classification} (${sentiment.value})`);
console.log(`📌 Volatilidad (ATR): ${atr.toFixed(2)}`);
console.log(`\n🎯 Recomendación:\n${estrategia}\n`);
// 🧾 Exportar a JSON
const report = {
    timestamp: new Date().toISOString(),
    rsi: rsi.toFixed(2),
    macd: macd.toFixed(2),
    emaSignal,
    atr: atr.toFixed(2),
    sentiment: sentiment,
    estrategia
};
const reportPath = node_path_1.default.join(__dirname, '../data/diagnosticReport.json');
node_fs_1.default.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`✅ Informe guardado en diagnosticReport.json`);
