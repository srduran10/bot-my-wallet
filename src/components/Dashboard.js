// src/components/Dashboard.js
import React, { useContext } from 'react';
import { usePrices } from '../hooks/usePrices';
import { PortfolioContext } from '../context/PortfolioContext';

export default function Dashboard() {
  const { prices, loading, error } = usePrices();
  const { portfolio } = useContext(PortfolioContext);

  if (loading) return <p>Cargando precios…</p>;
  if (error) return <p>Error al cargar precios</p>;

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>📊 Precios (USD)</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {Object.entries(prices).map(([coin, data]) => (
          <li
            key={coin}
            style={{
              margin: '0.5rem 0',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ textTransform: 'capitalize' }}>{coin}</span>
            <span>${data.usd.toLocaleString()}</span>
          </li>
        ))}
      </ul>

      <h2>💼 Portafolio</h2>
      {portfolio.length === 0 ? (
        <p>No has añadido posiciones</p>
      ) : (
        <ul>
          {portfolio.map((pos) => (
            <li key={pos.symbol}>
              {pos.symbol}: {pos.quantity} @ ${pos.avgPrice}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
