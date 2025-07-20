// src/hooks/usePrices.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export function usePrices(ids = ['bitcoin', 'ethereum']) {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(
          ','
        )}&vs_currencies=usd`
      )
      .then((res) => {
        setPrices(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [ids]);

  return { prices, loading, error };
}
