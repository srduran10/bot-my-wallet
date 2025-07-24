"use strict";
/**
 * Ajusta parámetros técnicos según historial de resultados
 * Requiere acceso a history.json con campos: symbol, rsi, macd, outcome
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoAdjustStrategy = autoAdjustStrategy;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const historyPath = path_1.default.resolve('src/data/history.json');
function autoAdjustStrategy(symbol, rsi, macd) {
    if (!fs_1.default.existsSync(historyPath))
        return { slPercent: 2, tpPercent: 3 };
    const rawData = JSON.parse(fs_1.default.readFileSync(historyPath));
    const recentTrades = rawData.filter(entry => entry.symbol === symbol &&
        entry.outcome &&
        typeof entry.rsi === 'number' &&
        typeof entry.macd === 'number').slice(-20);
    const winRate = recentTrades.filter(t => t.outcome === 'win').length / recentTrades.length || 0;
    let slPercent = 2;
    let tpPercent = 3;
    let confirmation = 'dual';
    if (winRate < 0.5) {
        slPercent += 0.5;
        tpPercent -= 0.5;
        confirmation = 'triple';
    }
    if (rsi > 75 && winRate < 0.3) {
        confirmation = 'strict';
        tpPercent = 2;
    }
    return { slPercent, tpPercent, confirmation, winRate: +(winRate * 100).toFixed(1) };
}
