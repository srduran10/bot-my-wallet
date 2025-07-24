// 🧠 Clasifica perfil según capital disponible
export function getRiskProfile(capital) {
  if (capital <= 30) return 'rescate';
  if (capital <= 100) return 'cauto';
  if (capital <= 500) return 'activo';
  if (capital <= 1000) return 'expansivo';
  return 'agresivo';
}

// 📊 Evalúa si se debe operar según perfil y fuerza de señal
export function shouldExecuteTrade(profile, signalStrength) {
  const thresholds = {
    rescate: 85,
    cauto: 75,
    activo: 65,
    expansivo: 55,
    agresivo: 45
  };

  return signalStrength >= thresholds[profile];
}

// 🗒️ Devuelve notas tácticas según perfil
export function getExecutionNotes(profile) {
  const notes = {
    rescate: '🛑 Modo Rescate activado — operando solo con señales >85%',
    cauto: '🧤 Perfil Cauto — prioriza señales >75%',
    activo: '🏃‍♂️ Perfil Activo — busca movimiento razonable >65%',
    expansivo: '🚀 Perfil Expansivo — amplía el rango >55%',
    agresivo: '🔥 Perfil Agresivo — operando sin miedo >45%'
  };

  return notes[profile] || '⚠️ Perfil desconocido';
}

// 🛡️ Calcula niveles de SL y TP según estrategia
export function calculateRiskLevels(entryPrice, side, slPercent, tpPercent) {
  const isBuy = side === 'BUY';
  const stopLoss = isBuy
    ? entryPrice * (1 - slPercent / 100)
    : entryPrice * (1 + slPercent / 100);

  const takeProfit = isBuy
    ? entryPrice * (1 + tpPercent / 100)
    : entryPrice * (1 - tpPercent / 100);

  return { stopLoss, takeProfit };
}