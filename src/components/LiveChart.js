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

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function LiveChart() {
  const [btcData, setBtcData] = useState([]);
  const [ethData, setEthData] = useState([]);
  const [labels, setLabels] = useState([]);

  const fetchPrices = async () => {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
      );
      const json = await res.json();
      const now = new Date().toLocaleTimeString();
      setLabels((prev) => [...prev.slice(-9), now]);
      setBtcData((prev) => [...prev.slice(-9), json.bitcoin.usd]);
      setEthData((prev) => [...prev.slice(-9), json.ethereum.usd]);
    } catch (err) {
      console.error('Error al obtener precios:', err);
    }
  };

  useEffect(() => {
    fetchPrices(); // primera carga
    const interval = setInterval(fetchPrices, 30000); // cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: 'Bitcoin (USD)',
        data: btcData,
        borderColor: '#f2a900',
        backgroundColor: 'rgba(242,169,0,0.2)',
        tension: 0.3
      },
      {
        label: 'Ethereum (USD)',
        data: ethData,
        borderColor: '#3c3c3d',
        backgroundColor: 'rgba(60,60,61,0.2)',
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <h2>📈 Evolución en vivo de BTC y ETH</h2>
      <Line data={data} options={options} />
    </div>
  );
}
