"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTestCycle = runTestCycle;
const signalEngine_js_1 = require("../strategy/signalEngine.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const walletManager_js_1 = require("../modules/walletManager.js");
const walletPath = path_1.default.resolve('src/data/wallet.json');
const logPath = path_1.default.resolve('src/data/dailyLog.json');
const historyPath = path_1.default.resolve('src/data/history.json');
async function runTestCycle() {
    if (!(0, walletManager_js_1.hasEnoughCapital)(10)) {
        console.log('⛔ Capital insuficiente para operar. Ciclo detenido.');
        return;
    }
    const wallet = (0, walletManager_js_1.getWallet)();
    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
    let totalGain = 0;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: true });
    for (const symbol of symbols) {
        const { outcome, probability } = await (0, signalEngine_js_1.evaluateSignal)(symbol);
        if (outcome === 'win')
            totalGain += 15;
        if (outcome === 'loss')
            totalGain -= 12;
        console.log(`📍 Señal registrada: ${symbol} — ${outcome.toUpperCase()} (${probability}%)`);
        const historyEntry = {
            timestamp,
            symbol,
            outcome,
            probability
        };
        let history = [];
        if (fs_1.default.existsSync(historyPath)) {
            history = JSON.parse(fs_1.default.readFileSync(historyPath));
        }
        history.push(historyEntry);
        fs_1.default.writeFileSync(historyPath, JSON.stringify(history, null, 2));
    }
    (0, walletManager_js_1.updateWallet)(totalGain);
    const updatedWallet = (0, walletManager_js_1.getWallet)();
    let dailyLog = [];
    if (fs_1.default.existsSync(logPath)) {
        dailyLog = JSON.parse(fs_1.default.readFileSync(logPath));
    }
    dailyLog.push({
        date: new Date().toISOString().split('T')[0],
        change: totalGain,
        capital: parseFloat(updatedWallet.current.toFixed(2))
    });
    fs_1.default.writeFileSync(logPath, JSON.stringify(dailyLog, null, 2));
    console.log(`✅ Ciclo completo — Capital actualizado: $${updatedWallet.current.toFixed(2)}`);
}
// 🧠 Solo ejecuta el ciclo si este archivo se lanza directamente
if (import.meta.url === process.argv[1]) {
    runTestCycle();
}
