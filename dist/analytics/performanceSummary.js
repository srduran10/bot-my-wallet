"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePerformanceSummary = generatePerformanceSummary;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const historyPath = path_1.default.resolve('src/data/history.json');
const logPath = path_1.default.resolve('src/data/dailyLog.json');
const walletPath = path_1.default.resolve('src/data/wallet.json');
const outputPath = path_1.default.resolve('src/data/performanceSummary.json');
function generatePerformanceSummary() {
    try {
        const history = JSON.parse(fs_1.default.readFileSync(historyPath));
        const wallet = JSON.parse(fs_1.default.readFileSync(walletPath));
        const dailyLog = JSON.parse(fs_1.default.readFileSync(logPath));
        const lastHour = history.slice(-12); // 4 ciclos × 3 señales
        const win = lastHour.filter(s => s.outcome === 'win').length;
        const loss = lastHour.filter(s => s.outcome === 'loss').length;
        const pending = lastHour.filter(s => s.outcome === 'pending').length;
        const lastEntries = dailyLog.slice(-4);
        const netGain = lastEntries.reduce((acc, e) => acc + e.change, 0);
        const summary = {
            timestamp: new Date().toISOString(),
            cyclesAnalyzed: 4,
            signalsEvaluated: 12,
            outcomes: { win, loss, pending },
            netGain: parseFloat(netGain.toFixed(2)),
            capital: wallet.current,
            precision: ((win / (win + loss)) * 100 || 0).toFixed(2) + '%'
        };
        fs_1.default.writeFileSync(outputPath, JSON.stringify(summary, null, 2));
        console.log('✅ Resumen táctico generado en performanceSummary.json');
    }
    catch (err) {
        console.error('⛔ Error generando resumen:', err);
    }
}
