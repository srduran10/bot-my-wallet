import { useEffect, useState } from 'react';

export default function MarketSentiment() {
  const [stats, setStats] = useState({ win: 0, loss: 0 });

  useEffect(() => {
    fetch('/src/data/history.json')
      .then(res => res.json())
      .then(data => {
        const win = data.filter(s => s.outcome === 'win').length;
        const loss = data.filter(s => s.outcome === 'loss').length;
        setStats({ win, loss });
      })
      .catch(err => console.error('Error analizando señales:', err));
  }, []);

  return (
    <div className="card">
      <h3>💬 Sentimiento de mercado</h3>
      <p>✅ WIN: {stats.win}</p>
      <p>❌ LOSS: {stats.loss}</p>
      <p>🎯 Precisión estimada: {(stats.win / (stats.win + stats.loss) * 100 || 0).toFixed(2)}%</p>
    </div>
  );
}