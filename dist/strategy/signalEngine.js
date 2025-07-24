"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateSignal = evaluateSignal;
const binanceClient_js_1 = __importDefault(require("../utils/binanceClient.js"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Genera una señal de operación para un símbolo específico
 * Evalúa indicadores simulados y registra resultado en el historial
 */
async function evaluateSignal(symbol) {
    try {
        // Consulta precio actual
        const prices = await binanceClient_js_1.default.prices(symbol);
        const price = parseFloat(prices[symbol]);
        // Indicadores simulados
        const rsi = Math.floor(Math.random() * 40) + 30; // 30–70
        const macd = parseFloat((Math.random() * 2 - 1).toFixed(2)); // -1.00 a +1.00
        const probability = parseFloat((50 + Math.random() * 30).toFixed(1)); // 50–80%
        // Determina sentimiento
        const sentimentLabel = probability > 70 ? 'Greedy' :
            probability < 55 ? 'Fear' :
                'Neutral';
        // Determina resultado simulado
        const outcome = probability > 65 ? 'win' :
            probability < 50 ? 'loss' :
                'pending';
        // Construye señal
        const signal = {
            timestamp: Date.now(),
            symbol,
            price,
            rsi,
            macd,
            sentiment: { label: sentimentLabel },
            prediction: probability,
            outcome
        };
        // Actualiza history.json
        const historyPath = path_1.default.resolve('src/data/history.json');
        const history = fs_1.default.existsSync(historyPath)
            ? JSON.parse(fs_1.default.readFileSync(historyPath))
            : [];
        history.push(signal);
        fs_1.default.writeFileSync(historyPath, JSON.stringify(history, null, 2));
        console.log(`📍 Señal registrada: ${symbol} — ${outcome.toUpperCase()} (${probability}%)`);
        return signal;
    }
    catch (error) {
        console.error(`❌ Error al generar señal para ${symbol}:`, error.message);
        return null;
    }
}
