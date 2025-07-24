import { useEffect, useState } from 'react';

export default function SignalTable() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    fetch('/src/data/history.json')
      .then(res => res.json())
      .then(data => setSignals(data.slice(-15).reverse()))
      .catch(err => console.error('Error leyendo history.json:', err));
  }, []);

  return (
    <div className="card">
      <h3>📊 Últimas señales</h3>
      <table>
        <thead>
          <tr>
            <th>⏱️</th><th>Symbol</th><th>Outcome</th><th>Prob</th>
          </tr>
        </thead>
        <tbody>
          {signals.map((s, idx) => (
            <tr key={idx}>
              <td>{s.timestamp}</td>
              <td>{s.symbol}</td>
              <td>{s.outcome}</td>
              <td>{s.probability}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}