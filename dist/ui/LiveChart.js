"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LiveChart;
const react_1 = __importStar(require("react"));
const react_chartjs_2_1 = require("react-chartjs-2");
const chart_js_1 = require("chart.js");
chart_js_1.Chart.register(chart_js_1.LineElement, chart_js_1.PointElement, chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.Tooltip, chart_js_1.Legend);
function LiveChart({ portfolio }) {
    const [labels, setLabels] = (0, react_1.useState)([]);
    const [datasets, setDatasets] = (0, react_1.useState)([]);
    // Construye los símbolos dinámicos para Binance
    const symbols = portfolio.map((p) => `${p.symbol.toUpperCase()}USDT`);
    const fetchLive = async () => {
        try {
            const now = new Date().toLocaleTimeString();
            setLabels((prev) => [...prev.slice(-9), now]);
            const prices = {};
            for (const symbol of symbols) {
                const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
                const { price } = await res.json();
                prices[symbol] = parseFloat(price);
            }
            setDatasets((prev) => {
                return symbols.map((symbol, idx) => {
                    const prevData = prev[idx]?.data.slice(-9) || [];
                    return {
                        label: symbol,
                        data: [...prevData, prices[symbol]],
                        borderColor: idx === 0
                            ? '#f2a900'
                            : idx === 1
                                ? '#3c3c3d'
                                : `hsl(${(idx * 60) % 360},70%,50%)`,
                        backgroundColor: idx === 0
                            ? 'rgba(242,169,0,0.2)'
                            : idx === 1
                                ? 'rgba(60,60,61,0.2)'
                                : 'rgba(100,100,200,0.2)',
                        tension: 0.3
                    };
                });
            });
        }
        catch (err) {
            console.error('Error LiveChart Binance:', err);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchLive(); // primera carga
        const timer = setInterval(fetchLive, 30000);
        return () => clearInterval(timer);
    }, [portfolio]);
    const data = { labels, datasets };
    const options = {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: false } }
    };
    return (<div style={{ margin: '1rem 0' }}>
      <h2>📈 Evolución en vivo (Binance)</h2>
      <react_chartjs_2_1.Line data={data} options={options}/>
    </div>);
}
