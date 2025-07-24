"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MarketSentiment;
const react_1 = require("react");
function MarketSentiment() {
    const [stats, setStats] = (0, react_1.useState)({ win: 0, loss: 0 });
    (0, react_1.useEffect)(() => {
        fetch('/src/data/history.json')
            .then(res => res.json())
            .then(data => {
            const win = data.filter(s => s.outcome === 'win').length;
            const loss = data.filter(s => s.outcome === 'loss').length;
            setStats({ win, loss });
        })
            .catch(err => console.error('Error analizando señales:', err));
    }, []);
    return (<div className="card">
      <h3>💬 Sentimiento de mercado</h3>
      <p>✅ WIN: {stats.win}</p>
      <p>❌ LOSS: {stats.loss}</p>
      <p>🎯 Precisión estimada: {(stats.win / (stats.win + stats.loss) * 100 || 0).toFixed(2)}%</p>
    </div>);
}
