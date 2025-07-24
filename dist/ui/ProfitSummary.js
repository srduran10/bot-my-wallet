"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProfitSummary;
const react_1 = require("react");
function ProfitSummary() {
    const [capital, setCapital] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        fetch('/src/data/wallet.json')
            .then(res => res.json())
            .then(data => setCapital(data.current))
            .catch(err => console.error('Error leyendo wallet.json:', err));
    }, []);
    return (<div className="card">
      <h3>💰 Capital actual</h3>
      <p>{capital !== null ? `$${capital.toFixed(2)}` : 'Cargando...'}</p>
    </div>);
}
