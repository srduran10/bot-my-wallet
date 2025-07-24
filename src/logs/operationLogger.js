import fs from 'fs';
import path from 'path';

const logPath = path.resolve('src/data/operationLog.json');

export function logNarrative({ symbol, outcome, probability, capitalUsed, pnl }) {
  const action = outcome === 'win' ? 'ganó' : outcome === 'loss' ? 'perdió' : 'mantuvo posición';
  const mood =
    probability >= 80 ? 'mercado confiable' :
    probability >= 65 ? 'tendencia técnica sólida' :
    'entorno técnico incierto';

  const insight =
    outcome === 'win' ? 'Patrón alcista confirmado con múltiples indicadores.' :
    outcome === 'loss' ? 'Se detectó desviación inesperada tras entrada válida.' :
    'No se ejecutó para proteger capital ante baja convicción.';

  const suggestion =
    outcome === 'win' ? 'Posibilidad de expandir riesgo progresivamente.' :
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
  if (fs.existsSync(logPath)) {
    log = JSON.parse(fs.readFileSync(logPath));
  }
  log.push(entry);

  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  console.log(`📘 Bitácora registrada para ${symbol} — ${outcome}`);
}