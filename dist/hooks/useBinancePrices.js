"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBinancePrices = useBinancePrices;
const react_1 = require("react");
function useBinancePrices(portfolio = []) {
    const [prices, setPrices] = (0, react_1.useState)({});
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(false);
    // Construye los pares USDT según lo que tengas en el portafolio
    const symbols = portfolio.map((p) => `${p.symbol.toUpperCase()}USDT`);
    const fetchBinance = async () => {
        try {
            setError(false);
            const fetched = {};
            for (const symbol of symbols) {
                const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
                if (!res.ok)
                    throw new Error(`Binance error: ${symbol}`);
                const { price } = await res.json();
                fetched[symbol] = parseFloat(price);
            }
            setPrices(fetched);
        }
        catch (err) {
            console.error('Error al obtener precios de Binance:', err);
            setError(true);
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        if (symbols.length > 0) {
            setLoading(true);
            fetchBinance();
        }
        else {
            setPrices({});
            setLoading(false);
        }
    }, [portfolio]);
    return { prices, loading, error };
}
