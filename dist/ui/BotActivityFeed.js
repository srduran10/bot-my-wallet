"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BotActivityFeed;
const react_1 = require("react");
function BotActivityFeed() {
    const [history, setHistory] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        fetch('/src/data/history.json')
            .then(res => res.json())
            .then(data => setHistory(data.slice(-10).reverse())) // últimos 10 eventos
            .catch(err => console.error('Error leyendo history.json:', err));
    }, []);
    return (<div className="card">
      <h3>🔁 Actividad reciente del bot</h3>
      <ul>
        {history.map((event, idx) => (<li key={idx}>
            {event.timestamp} — {event.symbol}: {event.outcome.toUpperCase()} ({event.probability}%)
          </li>))}
      </ul>
    </div>);
}
