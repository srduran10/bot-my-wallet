import React, { useContext } from 'react';
import { useBinancePrices } from '../hooks/useBinancePrices';
import { PortfolioContext } from '../context/PortfolioContext';
import LiveChart from './LiveChart';

export default function Dashboard() {
  const { portfolio, removePosition } = useContext(PortfolioContext);
  const { prices, loading, error } = useBinancePrices(portfolio);

  console.log('Contenido del portafolio:', portfolio);

  const calculatePerformance = (pos) => {
    const symbolKey = `${pos.symbol.toUpperCase()}USDT`;
    const currentPrice = prices[symbolKey];
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
      <LiveChart portfolio={portfolio} />

      <h2>💼 Portafolio</h2>
      {portfolio.length === 0 ? (
        <p>No has añadido posiciones</p>
      ) : (
        <ul style={{ paddingLeft: 0 }}>
          {portfolio.map((pos) => {
            const perf = calculatePerformance(pos);
            const color =
              perf?.profit > 0
                ? 'green'
                : perf?.profit < 0
                ? 'red'
                : 'gray';
            return (
              <li
                key={`${pos.symbol}-${pos.avgPrice}-${pos.quantity}`}
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
                </strong>
                : {pos.quantity} @ ${pos.avgPrice}

                {perf ? (
                  <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Valor actual: ${perf.valueNow.toFixed(2)}
                    <br />
                    Ganancia/Pérdida: ${perf.profit.toFixed(2)}
                    <br />
                    Variación: {perf.percent.toFixed(2)}%
                  </div>
                ) : (
                  <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    ⏳ Aún cargando precio desde Binance…
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

      {loading && <p>⏳ Cargando precios desde Binance…</p>}
      {error && (
        <p style={{ color: 'red' }}>
          ❌ Error al obtener precios desde Binance
        </p>
      )}
    </div>
  );
}
