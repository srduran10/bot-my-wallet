"use strict";
/**
 * Simulación del índice de miedo y codicia del mercado
 * Puedes conectarlo a fuentes reales como alternative.me o CNN Business
 * Si necesitas conexión con Axios para datos reales, te lo integro luego
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMarketSentiment = getMarketSentiment;
async function getMarketSentiment() {
    // 🔮 Simulación de clasificación aleatoria
    const classifications = [
        'Extreme Fear', 'Fear', 'Neutral', 'Greed', 'Extreme Greed'
    ];
    const value = Math.floor(Math.random() * 100);
    const index = value < 10 ? 0
        : value < 30 ? 1
            : value < 55 ? 2
                : value < 75 ? 3
                    : 4;
    return {
        value,
        classification: classifications[index],
        source: 'Simulated Sentiment Engine'
    };
}
