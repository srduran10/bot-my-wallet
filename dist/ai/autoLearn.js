"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoLearnFromHistory = autoLearnFromHistory;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const historyPath = path_1.default.resolve('src/data/history.json');
const learnPath = path_1.default.resolve('src/data/learningSnapshot.json');
function autoLearnFromHistory() {
    const history = JSON.parse(fs_1.default.readFileSync(historyPath));
    const recent = history.slice(-48); // Últimos 16 ciclos = 3 señales cada
    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
    const insights = {};
    symbols.forEach(symbol => {
        const filtered = recent.filter(s => s.symbol === symbol);
        const total = filtered.length;
        const wins = filtered.filter(s => s.outcome === 'win').length;
        const losses = filtered.filter(s => s.outcome === 'loss').length;
        const precision = total > 0 ? ((wins / total) * 100).toFixed(2) : '0.00';
        insights[symbol] = {
            totalSignals: total,
            winRatio: `${precision}%`,
            comment: precision >= 75 ? '🔥 Patrón dominante. Alta confiabilidad.' :
                precision >= 55 ? '📈 Patrón razonable. Puede escalarse.' :
                    '⚠️ Señal inconsistente. Evaluar ajustes.'
        };
    });
    const snapshot = {
        timestamp: new Date().toISOString(),
        insights
    };
    fs_1.default.writeFileSync(learnPath, JSON.stringify(snapshot, null, 2));
    console.log('🧠 Aprendizaje actualizado automáticamente.');
}
