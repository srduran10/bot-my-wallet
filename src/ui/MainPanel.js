import React from 'react';
import './MainPanel.css';

import ProfitSummary from './ProfitSummary.js';
import BotActivityFeed from './BotActivityFeed.js';
import MarketSentiment from './MarketSentiment.js';
import SignalTable from './SignalTable.js';
import CryptoNewsFeed from './CryptoNewsFeed.js';
import DailyPerformance from './DailyPerformance.js';
import PilotStatusBanner from './PilotStatusBanner.js';
import RealProfitProjection from './RealProfitProjection.js';

function MainPanel() {
  return (
    <div className="panel-wrapper">
      <h2 className="panel-title">📊 BotMyWallet — Diagnóstico Inteligente</h2>

      {/* Indicadores del piloto */}
      <PilotStatusBanner />
      <RealProfitProjection />

      {/* Paneles operativos */}
      <ProfitSummary />
      <BotActivityFeed />
      <MarketSentiment />
      <SignalTable />
      <CryptoNewsFeed />

      {/* Evolución del rendimiento */}
      <DailyPerformance />
    </div>
  );
}

export default MainPanel;