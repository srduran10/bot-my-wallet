import fetch from 'node-fetch'

export async function getFearGreedIndex() {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=1&format=json')
    const data = await res.json()
    const value = parseInt(data?.data?.[0]?.value, 10)
    console.log(🧠 Fear & Greed Index: ${value})
    return value
  } catch (err) {
    console.error('❌ Error al obtener el índice emocional:', err.message)
    return null
  }
}
