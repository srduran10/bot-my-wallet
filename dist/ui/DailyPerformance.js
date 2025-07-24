"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DailyPerformance;
const react_1 = require("react");
function DailyPerformance() {
    const [log, setLog] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        fetch('/src/data/dailyLog.json')
            .then(res => res.json())
            .then(data => setLog(data))
            .catch(err => console.error('Error leyendo dailyLog.json:', err));
    }, []);
    return (<div className="card">
      <h3>📆 Rendimiento diario</h3>
      <ul>
        {log.map((entry, idx) => (<li key={idx}>
            <strong>{entry.date}</strong> — Capital: ${entry.capital} ({entry.change >= 0 ? '+' : ''}{entry.change})
          </li>))}
      </ul>
    </div>);
}
