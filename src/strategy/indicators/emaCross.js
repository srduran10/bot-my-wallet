import { EMA } from 'technicalindicators'

/**
 * Recibe una lista de precios y detecta cruces entre dos EMAs.
 * @param {number[]} prices - Lista de precios (closing prices)
 * @param {number} shortPeriod - Periodo de la EMA rápida
 * @param {number} longPeriod - Periodo de la EMA lenta
 * @returns {'BUY'|'SELL'|'HOLD'}
 */
export function detectEmaCross(prices, shortPeriod = 9, longPeriod = 21) {
  if (!Array.isArray(prices) || prices.length < longPeriod + 2) {
    console.warn('⚠️ Lista de precios insuficiente para cálculo de EMA.')
    return 'HOLD'
  }

  const shortEma = EMA.calculate({ period: shortPeriod, values: prices })
  const longEma = EMA.calculate({ period: longPeriod, values: prices })

  const prevShort = shortEma[shortEma.length - 2]
  const currShort = shortEma[shortEma.length - 1]
  const prevLong = longEma[longEma.length - 2]
  const currLong = longEma[longEma.length - 1]

  if (prevShort < prevLong && currShort > currLong) return 'BUY'
  if (prevShort > prevLong && currShort < currLong) return 'SELL'
  return 'HOLD'
}
