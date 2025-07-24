/**
 * Calcula el RSI sobre un arreglo de precios de cierre
 * @param {number[]} prices - precios de cierre históricos
 * @param {number} period - ventana de cálculo, por defecto 14
 * @returns {number} - valor RSI entre 0 y 100
 */
export function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) return 50

  let gains = 0
  let losses = 0

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1]
    if (diff >= 0) gains += diff
    else losses -= diff
  }

  const avgGain = gains / period
  const avgLoss = losses / period
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
  const rsi = 100 - 100 / (1 + rs)

  return rsi
}