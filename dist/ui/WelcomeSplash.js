"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./WelcomeSplash.css");
function WelcomeSplash() {
    return (<div className="welcome-wrapper">
      <div className="hero-card">
        <h1 className="hero-title">BotMyWallet</h1>
        <p className="hero-subtitle">Tu estratega cripto con inteligencia adaptativa</p>
        <button className="hero-button">Entrar al Dashboard</button>
      </div>
    </div>);
}
exports.default = WelcomeSplash;
