"use strict";
// Ejecuta este script manualmente con: node src/data/updatePriceHistory.js
// O automáticamente cada 12 horas vía cron (instrucción abajo)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = require("node:url");
const binanceClient_js_1 = require("../utils/binanceClient.js");
const __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
const __dirname = node_path_1.default.dirname(__filename);
// 🪙 Activos a actualizar
const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'MATICUSDT'];
const interval = '1h';
const limit = 50;
async function updateHistoryForSymbol(symbol) {
    try {
        console.log(`🔄 Descargando datos de ${symbol}...`);
        const candles = await binanceClient_js_1.client.candles({ symbol, interval, limit });
        const history = candles.map(c => ({
            timestamp: c.closeTime,
            close: parseFloat(c.close)
        }));
        const filePath = node_path_1.default.join(__dirname, `${symbol}_priceHistory.json`);
        node_fs_1.default.writeFileSync(filePath, JSON.stringify(history, null, 2));
        console.log(`✅ ${symbol} actualizado: ${history.length} registros`);
    }
    catch (err) {
        console.error(`❌ Error en ${symbol}: ${err.message}`);
    }
}
async function updateAll() {
    console.log('\n📦 Iniciando actualización de activos...\n');
    for (const symbol of symbols) {
        await updateHistoryForSymbol(symbol);
    }
    console.log('\n🧠 Actualización completada\n');
}
updateAll();
