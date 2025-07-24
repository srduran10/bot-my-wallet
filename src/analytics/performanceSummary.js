import fs from 'fs';
import path from 'path';

const historyPath = path.resolve('src/data/history.json');
const logPath = path.resolve('src/data/dailyLog.json');
const walletPath = path.resolve('src/data/wallet.json');
const outputPath = path.resolve('src/data/performanceSummary.json');

export function generatePerformanceSummary() {
  try {
    const history = JSON.parse(fs.readFileSync(historyPath));
    const wallet = JSON.parse(fs.readFileSync(walletPath));
    const dailyLog = JSON.parse(fs.readFileSync(logPath));
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

    fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));
    console.log('✅ Resumen táctico generado en performanceSummary.json');
  } catch (err) {
    console.error('⛔ Error generando resumen:', err);
  }
}
