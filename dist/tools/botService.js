"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSignals = fetchSignals;
exports.fetchSentiment = fetchSentiment;
exports.fetchNews = fetchNews;
exports.fetchProfit = fetchProfit;
exports.fetchActivities = fetchActivities;
async function fetchSignals() {
    return [
        { symbol: 'BTCUSDT', rsi: 72, macd: 1.4, sentiment: 'Greedy', probability: 67.2, outcome: 'pending' },
        { symbol: 'ETHUSDT', rsi: 55, macd: -0.3, sentiment: 'Neutral', probability: 74.5, outcome: 'win' }
    ];
}
async function fetchSentiment() {
    return { label: 'Greedy', value: 72 };
}
async function fetchNews() {
    return [
        'BlackRock aumenta exposición en Ethereum',
        'Reguladores europeos aprueban ETF de Bitcoin',
        'China investiga minería de altcoins'
    ];
}
async function fetchProfit() {
    return { initial: 1000, current: 1265, return: 26.5 };
}
async function fetchActivities() {
    return [
        '📈 Señal ejecutada: BTCUSDT Long',
        '🧠 Modelo entrenado con datos Q3',
        '🔍 Evaluación técnica ETHUSDT completada'
    ];
}
