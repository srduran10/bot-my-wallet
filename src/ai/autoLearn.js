import fs from 'fs';
import path from 'path';

const historyPath = path.resolve('src/data/history.json');
const learnPath = path.resolve('src/data/learningSnapshot.json');

export function autoLearnFromHistory() {
  const history = JSON.parse(fs.readFileSync(historyPath));
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
      comment:
        precision >= 75 ? '🔥 Patrón dominante. Alta confiabilidad.' :
        precision >= 55 ? '📈 Patrón razonable. Puede escalarse.' :
        '⚠️ Señal inconsistente. Evaluar ajustes.'
    };
  });

  const snapshot = {
    timestamp: new Date().toISOString(),
    insights
  };

  fs.writeFileSync(learnPath, JSON.stringify(snapshot, null, 2));
  console.log('🧠 Aprendizaje actualizado automáticamente.');
}