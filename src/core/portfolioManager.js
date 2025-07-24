import fs from 'fs';
import path from 'path';

const portfolioPath = path.resolve('src/data/portfolio.json');

// 🧠 Inicializa el archivo si no existe
export function getPortfolio() {
  if (!fs.existsSync(portfolioPath)) {
    const initial = {
      positions: [],
      history: [],
      totalInvested: 0,
      totalReturn: 0
    };
    fs.writeFileSync(portfolioPath, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(portfolioPath));
}

// 📌 Guarda cambios en archivo
export function savePortfolio(portfolio) {
  fs.writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2));
}

// ✅ Registrar apertura de posición
export function openPosition(symbol, amount = 15) {
  const portfolio = getPortfolio();
  const position = {
    symbol,
    amount,
    timestamp: new Date().toISOString()
  };
  portfolio.positions.push(position);
  portfolio.totalInvested += amount;
  savePortfolio(portfolio);
  console.log(`📥 Apertura registrada en ${symbol} — $${amount}`);
}

// 📤 Cerrar posición y calcular retorno
export function closePosition(symbol, result = 'win') {
  const portfolio = getPortfolio();
  const positionIndex = portfolio.positions.findIndex(p => p.symbol === symbol);

  if (positionIndex === -1) {
    console.warn(`⚠️ No se encontró posición abierta para ${symbol}`);
    return;
  }

  const closed = portfolio.positions.splice(positionIndex, 1)[0];
  const pnl = result === 'win'
    ? closed.amount * 1.12
    : result === 'loss'
      ? closed.amount * 0.85
      : closed.amount;

  portfolio.history.push({
    symbol,
    result,
    entry: closed.amount,
    exit: parseFloat(pnl.toFixed(2)),
    change: parseFloat((pnl - closed.amount).toFixed(2)),
    timestamp: new Date().toISOString()
  });

  portfolio.totalReturn += pnl;
  savePortfolio(portfolio);
  console.log(`📤 Posición cerrada en ${symbol} — Resultado: ${result}, PnL: $${pnl.toFixed(2)}`);
}

// 📊 Obtener estadísticas actuales
export function getPortfolioStats() {
  const portfolio = getPortfolio();
  const winCount = portfolio.history.filter(h => h.result === 'win').length;
  const lossCount = portfolio.history.filter(h => h.result === 'loss').length;
  const precision = ((winCount / (winCount + lossCount)) * 100).toFixed(2) || 0;

  return {
    positionsOpen: portfolio.positions.length,
    totalInvested: portfolio.totalInvested.toFixed(2),
    totalReturn: portfolio.totalReturn.toFixed(2),
    winCount,
    lossCount,
    precision: `${precision}%`
  };
}

// 💼 Obtener balance actual (retorno - inversión)
export function getCurrentBalance() {
  const portfolio = getPortfolio();
  const balance = portfolio.totalReturn - portfolio.totalInvested;
  return parseFloat(balance.toFixed(2));
}

// 🔍 Última operación registrada
export function getLastOperation() {
  const { history } = getPortfolio();
  if (!history.length) return null;
  return history[history.length - 1];
}