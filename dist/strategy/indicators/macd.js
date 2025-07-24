"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMACD = calculateMACD;
/**
 * Calcula el MACD como diferencia entre EMA rápida y EMA lenta
 * @param {number[]} prices - arreglo de precios de cierre
 * @param {number} fastPeriod - período EMA rápida, por defecto 12
 * @param {number} slowPeriod - período EMA lenta, por defecto 26
 * @returns {number} - valor MACD
 */
function calculateMACD(prices, fastPeriod = 12, slowPeriod = 26) {
    if (prices.length < slowPeriod)
        return 0;
    const k = (period) => 2 / (period + 1);
    const ema = (arr, period) => {
        let emaVal = arr.slice(0, period).reduce((a, b) => a + b, 0) / period;
        for (let i = period; i < arr.length; i++) {
            emaVal = arr[i] * k(period) + emaVal * (1 - k(period));
        }
        return emaVal;
    };
    const emaFast = ema(prices, fastPeriod);
    const emaSlow = ema(prices, slowPeriod);
    return emaFast - emaSlow;
}
