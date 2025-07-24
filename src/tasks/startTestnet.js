import { evaluateSignal } from '../strategy/signalEngine.js';
import fs from 'fs';
import path from 'path';
import { getWallet, updateWallet, hasEnoughCapital } from '../modules/walletManager.js';

const walletPath = path.resolve('src/data/wallet.json');
const logPath = path.resolve('src/data/dailyLog.json');
const historyPath = path.resolve('src/data/history.json');

export async function runTestCycle() {
  if (!hasEnoughCapital(10)) {
    console.log('⛔ Capital insuficiente para operar. Ciclo detenido.');
    return;
  }

  const wallet = getWallet();
  const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
  let totalGain = 0;

  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: true });

  for (const symbol of symbols) {
    const { outcome, probability } = await evaluateSignal(symbol);
    if (outcome === 'win') totalGain += 15;
    if (outcome === 'loss') totalGain -= 12;

    console.log(`📍 Señal registrada: ${symbol} — ${outcome.toUpperCase()} (${probability}%)`);

    const historyEntry = {
      timestamp,
      symbol,
      outcome,
      probability
    };

    let history = [];
    if (fs.existsSync(historyPath)) {
      history = JSON.parse(fs.readFileSync(historyPath));
    }
    history.push(historyEntry);
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  }

  updateWallet(totalGain);
  const updatedWallet = getWallet();

  let dailyLog = [];
  if (fs.existsSync(logPath)) {
    dailyLog = JSON.parse(fs.readFileSync(logPath));
  }

  dailyLog.push({
    date: new Date().toISOString().split('T')[0],
    change: totalGain,
    capital: parseFloat(updatedWallet.current.toFixed(2))
  });

  fs.writeFileSync(logPath, JSON.stringify(dailyLog, null, 2));

  console.log(`✅ Ciclo completo — Capital actualizado: $${updatedWallet.current.toFixed(2)}`);
}

// 🧠 Solo ejecuta el ciclo si este archivo se lanza directamente
if (import.meta.url === process.argv[1]) {
  runTestCycle();
}