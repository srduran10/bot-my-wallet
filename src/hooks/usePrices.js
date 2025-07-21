import { useState, useEffect } from 'react';

export function usePrices() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPrices = async () => {
    try {
      setError(false);
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,cardano&vs_currencies=usd'
      );
      if (!res.ok) throw new Error('API no responde');
      const json = await res.json();
      setPrices(json);
    } catch (err) {
      console.error('Error al obtener precios:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return { prices, loading, error };
}
