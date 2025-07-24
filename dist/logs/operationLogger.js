"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logNarrative = logNarrative;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logPath = path_1.default.resolve('src/data/operationLog.json');
function logNarrative({ symbol, outcome, probability, capitalUsed, pnl }) {
    const action = outcome === 'win' ? 'ganó' : outcome === 'loss' ? 'perdió' : 'mantuvo posición';
    const mood = probability >= 80 ? 'mercado confiable' :
        probability >= 65 ? 'tendencia técnica sólida' :
            'entorno técnico incierto';
    const insight = outcome === 'win' ? 'Patrón alcista confirmado con múltiples indicadores.' :
        outcome === 'loss' ? 'Se detectó desviación inesperada tras entrada válida.' :
            'No se ejecutó para proteger capital ante baja convicción.';
    const suggestion = outcome === 'win' ? 'Posibilidad de expandir riesgo progresivamente.' :
        outcome === 'loss' ? 'Reducir exposición si se repiten giros bruscos.' :
            'Mantener análisis profundo en próximas señales.';
    const entry = {
        timestamp: new Date().toISOString(),
        symbol,
        outcome,
        probability: parseFloat(probability.toFixed(2)),
        capitalUsed: parseFloat(capitalUsed.toFixed(2)),
        pnl: parseFloat(pnl.toFixed(2)),
        narrative: {
            acción: `BotMyWallet operó en ${symbol} y ${action} $${Math.abs(pnl).toFixed(2)}.`,
            mercado: `Análisis: ${mood}`,
            reflexión: insight,
            recomendación: suggestion
        }
    };
    let log = [];
    if (fs_1.default.existsSync(logPath)) {
        log = JSON.parse(fs_1.default.readFileSync(logPath));
    }
    log.push(entry);
    fs_1.default.writeFileSync(logPath, JSON.stringify(log, null, 2));
    console.log(`📘 Bitácora registrada para ${symbol} — ${outcome}`);
}
