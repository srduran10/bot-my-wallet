"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEMASignal = getEMASignal;
/**
 * Detecta reversión EMA por cruce de rápida sobre lenta
 * @param {number[]} prices - precios de cierre
 * @param {number} fastPeriod - EMA rápida, por defecto 9
 * @param {number} slowPeriod - EMA lenta, por defecto 21
 * @returns {'bullish'|'bearish'|'neutral'} - señal técnica
 */
function getEMASignal(prices, fastPeriod = 9, slowPeriod = 21) {
    if (prices.length < slowPeriod + 1)
        return 'neutral';
    const k = (period) => 2 / (period + 1);
    const ema = (arr, period) => {
        let emaVal = arr.slice(0, period).reduce((a, b) => a + b, 0) / period;
        for (let i = period; i < arr.length; i++) {
            emaVal = arr[i] * k(period) + emaVal * (1 - k(period));
        }
        return emaVal;
    };
    const emaFastPrev = ema(prices.slice(0, -1), fastPeriod);
    const emaSlowPrev = ema(prices.slice(0, -1), slowPeriod);
    const emaFastCurrent = ema(prices, fastPeriod);
    const emaSlowCurrent = ema(prices, slowPeriod);
    if (emaFastPrev < emaSlowPrev && emaFastCurrent > emaSlowCurrent)
        return 'bullish';
    if (emaFastPrev > emaSlowPrev && emaFastCurrent < emaSlowCurrent)
        return 'bearish';
    return 'neutral';
}
