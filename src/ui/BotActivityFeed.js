import { useEffect, useState } from 'react';

export default function BotActivityFeed() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch('/src/data/history.json')
      .then(res => res.json())
      .then(data => setHistory(data.slice(-10).reverse())) // últimos 10 eventos
      .catch(err => console.error('Error leyendo history.json:', err));
  }, []);

  return (
    <div className="card">
      <h3>🔁 Actividad reciente del bot</h3>
      <ul>
        {history.map((event, idx) => (
          <li key={idx}>
            {event.timestamp} — {event.symbol}: {event.outcome.toUpperCase()} ({event.probability}%)
          </li>
        ))}
      </ul>
    </div>
  );
}