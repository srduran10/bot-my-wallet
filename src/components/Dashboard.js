import React, { useContext } from 'react';
import { usePrices } from '../hooks/usePrices';
import { PortfolioContext } from '../context/PortfolioContext';

export default function Dashboard() {
  const { prices, loading, error } = usePrices();
  const { portfolio, removePosition } = useContext(PortfolioContext);

  console.log('Contenido del portafolio:', portfolio);

  if (loading) return <p>Cargando precios…</p>;
  if (error) return <p>Error al cargar precios</p>;

  const calculatePerformance = (pos) => {
    const currentPrice = prices[pos.symbol]?.usd;
    if (!currentPrice) return null;

    const valueNow = currentPrice * pos.quantity;
    const invested = pos.avgPrice * pos.quantity;
    const profit = valueNow - invested;
    const percent = ((valueNow / invested) - 1) * 100;

    return {
      valueNow,
      profit,
      percent,
      currentPrice
    };
  };

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

      <h2 style={{ marginTop: '2rem' }}>💼 Portafolio</h2>
      {portfolio.length === 0 ? (
        <p>No has añadido posiciones</p>
      ) : (
        <ul style={{ paddingLeft: 0 }}>
          {portfolio.map((pos) => {
            const perf = calculatePerformance(pos);
            const color = perf?.profit > 0 ? 'green' : perf?.profit < 0 ? 'red' : 'gray';
            return (
              <li
                key={pos.symbol}
                style={{
                  margin: '0.5rem 0',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  color,
                  position: 'relative'
                }}
              >
                <strong style={{ textTransform: 'capitalize' }}>
                  {pos.symbol}
                </strong>: {pos.quantity} @ ${pos.avgPrice}
                {perf && (
                  <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Valor actual: ${perf.valueNow.toFixed(2)}  
                    <br />
                    Ganancia/Pérdida: ${perf.profit.toFixed(2)}  
                    <br />
                    Variación: {perf.percent.toFixed(2)}%
                  </div>
                )}
                <button
                  onClick={() => removePosition(pos.symbol)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#ff4d4f',
                    color: 'white',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Eliminar
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
