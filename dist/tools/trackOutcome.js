"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const binanceClient_js_1 = require("../utils/binanceClient.js");
const historyPath = path_1.default.resolve('src/data/history.json');
const updatedHistory = [];
async function evaluateTrade(entry) {
    const { symbol, entry: entryPrice, sl, tp, timestamp, outcome } = entry;
    if (outcome && outcome !== 'pending')
        return entry;
    try {
        const { price: currentPriceRaw } = await binanceClient_js_1.client.prices({ symbol });
        const currentPrice = parseFloat(currentPriceRaw);
        const result = (entry.side === 'BUY')
            ? (currentPrice >= tp ? 'win' : currentPrice <= sl ? 'loss' : 'pending')
            : (currentPrice <= tp ? 'win' : currentPrice >= sl ? 'loss' : 'pending');
        console.log(`🧠 ${symbol}: ${entry.side} | Entry: ${entryPrice} | Current: ${currentPrice} → ${result}`);
        return { ...entry, outcome: result };
    }
    catch (err) {
        console.error(`❌ Error en ${symbol}: ${err.message}`);
        return entry;
    }
}
async function runOutcomeTracker() {
    if (!fs_1.default.existsSync(historyPath)) {
        console.error('❌ history.json no encontrado');
        return;
    }
    const raw = JSON.parse(fs_1.default.readFileSync(historyPath));
    for (const entry of raw) {
        const updated = await evaluateTrade(entry);
        updatedHistory.push(updated);
    }
    fs_1.default.writeFileSync(historyPath, JSON.stringify(updatedHistory, null, 2));
    console.log('✅ history.json actualizado con resultados');
}
runOutcomeTracker();
