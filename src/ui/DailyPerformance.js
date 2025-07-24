import { useEffect, useState } from 'react';

export default function DailyPerformance() {
  const [log, setLog] = useState([]);

  useEffect(() => {
    fetch('/src/data/dailyLog.json')
      .then(res => res.json())
      .then(data => setLog(data))
      .catch(err => console.error('Error leyendo dailyLog.json:', err));
  }, []);

  return (
    <div className="card">
      <h3>📆 Rendimiento diario</h3>
      <ul>
        {log.map((entry, idx) => (
          <li key={idx}>
            <strong>{entry.date}</strong> — Capital: ${entry.capital} ({entry.change >= 0 ? '+' : ''}{entry.change})
          </li>
        ))}
      </ul>
    </div>
  );
}