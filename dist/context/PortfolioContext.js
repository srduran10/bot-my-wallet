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
exports.PortfolioContext = void 0;
exports.PortfolioProvider = PortfolioProvider;
const react_1 = __importStar(require("react"));
exports.PortfolioContext = (0, react_1.createContext)([]);
function PortfolioProvider({ children }) {
    const [portfolio, setPortfolio] = (0, react_1.useState)(() => {
        const saved = localStorage.getItem('portfolio');
        return saved ? JSON.parse(saved) : [];
    });
    (0, react_1.useEffect)(() => {
        localStorage.setItem('portfolio', JSON.stringify(portfolio));
    }, [portfolio]);
    const addPosition = (position) => {
        console.log('Nueva posición agregada al contexto:', position);
        setPortfolio((prev) => [...prev, position]);
    };
    const removePosition = (symbol) => {
        setPortfolio((prev) => prev.filter((p) => p.symbol !== symbol));
    };
    return (<exports.PortfolioContext.Provider value={{ portfolio, addPosition, removePosition }}>
      {children}
    </exports.PortfolioContext.Provider>);
}
