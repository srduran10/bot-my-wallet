"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RealProfitProjection;
const react_1 = require("react");
function RealProfitProjection() {
    const [capital, setCapital] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        fetch('/src/data/wallet.json')
            .then(res => res.json())
            .then(data => setCapital(data.current))
            .catch(err => console.error('Error leyendo wallet.json:', err));
    }, []);
    const projected = capital ? (capital + 15 * 3 * 96).toFixed(2) : null; // suposición: 3 WIN por ciclo × 96 ciclos/día
    return (<div className="card">
      <h3>📌 Proyección de ganancia diaria</h3>
      <p>{projected ? `≈ $${projected}` : 'Calculando...'}</p>
    </div>);
}
