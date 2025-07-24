import { useEffect, useState } from 'react';

export default function ProfitSummary() {
  const [capital, setCapital] = useState(null);

  useEffect(() => {
    fetch('/src/data/wallet.json')
      .then(res => res.json())
      .then(data => setCapital(data.current))
      .catch(err => console.error('Error leyendo wallet.json:', err));
  }, []);

  return (
    <div className="card">
      <h3>💰 Capital actual</h3>
      <p>{capital !== null ? `$${capital.toFixed(2)}` : 'Cargando...'}</p>
    </div>
  );
}