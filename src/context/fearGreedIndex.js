import fetch from 'node-fetch'

/**
 * Obtiene el índice Fear & Greed y lo interpreta según su valor
 * Devuelve un objeto con value (0–100) y label emocional
 */
export async function getMarketSentiment() {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=1&format=json')
    const data = await res.json()

    const value = parseInt(data?.data?.[0]?.value, 10)

    const label =
      value >= 75 ? 'Extreme Greed' :
      value >= 60 ? 'Greedy' :
      value >= 45 ? 'Neutral' :
      value >= 30 ? 'Fear' :
      'Extreme Fear'

    return { value, label }

  } catch (err) {
    console.warn('⚠️ No se pudo obtener el Fear & Greed Index:', err.message)

    // Valor de respaldo simulado
    const fallback = Math.floor(Math.random() * 41) + 30
    const label =
      fallback >= 75 ? 'Extreme Greed' :
      fallback >= 60 ? 'Greedy' :
      fallback >= 45 ? 'Neutral' :
      fallback >= 30 ? 'Fear' :
      'Extreme Fear'

    return { value: fallback, label }
  }
}