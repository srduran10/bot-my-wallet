import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function LiveChart({ portfolio }) {
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);

  // Construye los símbolos dinámicos para Binance
  const symbols = portfolio.map((p) =>
    `${p.symbol.toUpperCase()}USDT`
  );

  const fetchLive = async () => {
    try {
      const now = new Date().toLocaleTimeString();
      setLabels((prev) => [...prev.slice(-9), now]);

      const prices = {};
      for (const symbol of symbols) {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
        );
        const { price } = await res.json();
        prices[symbol] = parseFloat(price);
      }

      setDatasets((prev) => {
        return symbols.map((symbol, idx) => {
          const prevData =
            prev[idx]?.data.slice(-9) || [];
          return {
            label: symbol,
            data: [...prevData, prices[symbol]],
            borderColor:
              idx === 0
                ? '#f2a900'
                : idx === 1
                ? '#3c3c3d'
                : `hsl(${(idx * 60) % 360},70%,50%)`,
            backgroundColor:
              idx === 0
                ? 'rgba(242,169,0,0.2)'
                : idx === 1
                ? 'rgba(60,60,61,0.2)'
                : 'rgba(100,100,200,0.2)',
            tension: 0.3
          };
        });
      });
    } catch (err) {
      console.error('Error LiveChart Binance:', err);
    }
  };

  useEffect(() => {
    fetchLive(); // primera carga
    const timer = setInterval(fetchLive, 30000);
    return () => clearInterval(timer);
  }, [portfolio]);

  const data = { labels, datasets };
  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: false } }
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <h2>📈 Evolución en vivo (Binance)</h2>
      <Line data={data} options={options} />
    </div>
  );
}
