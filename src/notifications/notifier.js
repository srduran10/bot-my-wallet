export function notifyOperation({ symbol, outcome, probability, capitalUsed, pnl }) {
  const action = outcome === 'win' ? 'ganó' : outcome === 'loss' ? 'perdió' : 'quedó neutral';
  const marketMood = probability >= 80
    ? 'mercado altamente confiable'
    : probability >= 65
    ? 'tendencia sólida con indicadores consistentes'
    : 'sentimiento mixto y señales poco estables';

  const insight = outcome === 'win'
    ? 'Identifiqué un patrón alcista con fuerte respaldo técnico.'
    : outcome === 'loss'
    ? 'La señal fue válida, pero el mercado giró inesperadamente.'
    : 'Preferí no actuar ante baja convicción para proteger capital.';

  const suggestion = outcome === 'win'
    ? 'Podemos aumentar gradualmente la exposición si esta tendencia se repite.'
    : outcome === 'loss'
    ? 'Sugiero limitar riesgo en próximos ciclos con señales más precisas.'
    : 'Continuar con precaución hasta tener mayor claridad técnica.';

  const message = `
📍 BotMyWallet operó en ${symbol}
🔎 Análisis del mercado: ${marketMood}
💼 Capital invertido: $${capitalUsed.toFixed(2)}
📈 Resultado: Se ${action} $${Math.abs(pnl).toFixed(2)}
🧠 Aprendizaje: ${insight}
💡 Sugerencia: ${suggestion}
  `;

  console.log(message);
  return message;
}
