"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./MainPanel.css");
const ProfitSummary_js_1 = __importDefault(require("./ProfitSummary.js"));
const BotActivityFeed_js_1 = __importDefault(require("./BotActivityFeed.js"));
const MarketSentiment_js_1 = __importDefault(require("./MarketSentiment.js"));
const SignalTable_js_1 = __importDefault(require("./SignalTable.js"));
const CryptoNewsFeed_js_1 = __importDefault(require("./CryptoNewsFeed.js"));
const DailyPerformance_js_1 = __importDefault(require("./DailyPerformance.js"));
const PilotStatusBanner_js_1 = __importDefault(require("./PilotStatusBanner.js"));
const RealProfitProjection_js_1 = __importDefault(require("./RealProfitProjection.js"));
function MainPanel() {
    return (<div className="panel-wrapper">
      <h2 className="panel-title">📊 BotMyWallet — Diagnóstico Inteligente</h2>

      {/* Indicadores del piloto */}
      <PilotStatusBanner_js_1.default />
      <RealProfitProjection_js_1.default />

      {/* Paneles operativos */}
      <ProfitSummary_js_1.default />
      <BotActivityFeed_js_1.default />
      <MarketSentiment_js_1.default />
      <SignalTable_js_1.default />
      <CryptoNewsFeed_js_1.default />

      {/* Evolución del rendimiento */}
      <DailyPerformance_js_1.default />
    </div>);
}
exports.default = MainPanel;
