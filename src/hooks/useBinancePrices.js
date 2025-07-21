import { useState, useEffect } from 'react';

export function useBinancePrices(portfolio) {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const symbols = portfolio.map((p) => `${p.symbol.toUpperCase()}USDT`);

  const fetchBinance = async () => {
    try {
      setError(false);
      const fetchedPrices = {};

      for (const symbol of symbols) {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
        );
        if (!res.ok) throw new Error(`Error Binance: ${symbol}`);
        const json = await res.json();
        fetchedPrices[symbol] = parseFloat(json.price);
      }

      setPrices(fetchedPrices);
    } catch (err) {
      console.error('Error al obtener precios de Binance:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbols.length > 0) {
      fetchBinance();
    } else {
      setPrices({});
      setLoading(false);
    }
  }, [portfolio]);

  return { prices, loading, error };
}
