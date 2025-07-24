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
exports.default = TransactionForm;
const react_1 = __importStar(require("react"));
const PortfolioContext_1 = require("../context/PortfolioContext");
function TransactionForm() {
    const { addPosition } = (0, react_1.useContext)(PortfolioContext_1.PortfolioContext);
    const [symbol, setSymbol] = (0, react_1.useState)('');
    const [quantity, setQuantity] = (0, react_1.useState)('');
    const [price, setPrice] = (0, react_1.useState)('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!symbol || !quantity || !price)
            return;
        const nuevaPosicion = {
            symbol: symbol.toLowerCase(),
            quantity: parseFloat(quantity),
            avgPrice: parseFloat(price)
        };
        console.log('Formulario enviado. Posición creada:', nuevaPosicion);
        addPosition(nuevaPosicion);
        setSymbol('');
        setQuantity('');
        setPrice('');
    };
    return (<form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <h2>📝 Simular compra</h2>
      <input type="text" placeholder="Símbolo (ej. bitcoin)" value={symbol} onChange={(e) => setSymbol(e.target.value)} required/>
      <input type="number" placeholder="Cantidad (ej. 0.25)" value={quantity} onChange={(e) => setQuantity(e.target.value)} required/>
      <input type="number" placeholder="Precio de compra (ej. 29650)" value={price} onChange={(e) => setPrice(e.target.value)} required/>
      <button type="submit" style={{ marginTop: '0.5rem' }}>
        Agregar al portafolio
      </button>
    </form>);
}
