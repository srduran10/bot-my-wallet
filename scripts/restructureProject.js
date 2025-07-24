import fs from 'fs';
import path from 'path';

const moves = [
  // 🔧 Core logic
  ['src/modules/walletManager.js', 'src/core/walletManager.js'],
  ['src/manager/portfolioManager.js', 'src/core/portfolioManager.js'],
  ['src/manager/positionManager.js', 'src/core/positionManager.js'],
  ['src/risk/riskManager.js', 'src/core/riskManager.js'],

  // ⚙️ Strategy & signals
  ['src/strategy/strategyTuner.js', 'src/strategy/strategyTuner.js'],
  ['src/strategy/signalEngine.js', 'src/strategy/signalEngine.js'],
  ['src/strategy/autoAdjustStrategy.js', 'src/strategy/autoAdjustStrategy.js'],
  ['src/strategy/indicators/rsi.js', 'src/strategy/indicators/rsi.js'],
  ['src/strategy/indicators/macd.js', 'src/strategy/indicators/macd.js'],
  ['src/strategy/indicators/emaReversal.js', 'src/strategy/indicators/emaReversal.js'],

  // 🔁 Remove duplicate indicators
  ['src/indicators/rsi.js', null],
  ['src/indicators/macd.js', null],
  ['src/indicators/emaCross.js', 'src/strategy/indicators/emaCross.js'],

  // 🤖 AI Engine
  ['src/ai/evaluateSignal.js', 'src/ai/evaluateSignal.js'],
  ['src/ai/learnFromHistory.js', 'src/ai/learnFromHistory.js'],
  ['src/ai/trainDaily.js', 'src/ai/trainDaily.js'],

  // 📊 Analytics
  ['src/analytics/performanceSummary.js', 'src/analytics/performanceSummary.js'],

  // 🧩 Tasks
  ['src/tasks/scheduler.js', 'src/tasks/scheduler.js'],
  ['src/tasks/startTestnet.js', 'src/tasks/startTestnet.js'],

  // 📬 Notifications (excluyendo notifier.js)
  ['src/mailSender.js', 'src/notifications/mailSender.js'],

  // ⚛️ UI Components
  ['src/components/MainPanel.js', 'src/ui/MainPanel.js'],
  ['src/components/CryptoNewsFeed.js', 'src/ui/CryptoNewsFeed.js'],
  ['src/components/TransactionForm.js', 'src/ui/TransactionForm.js'],
  ['src/components/WelcomeSplash.css', 'src/ui/WelcomeSplash.css'],
  ['src/components/WelconmeSplash.js', 'src/ui/WelcomeSplash.js'],
  ['src/components/LiveChart.js', 'src/ui/LiveChart.js'],
  ['src/components/MarketSentiment.js', 'src/ui/MarketSentiment.js'],
  ['src/components/ProfitSummary.js', 'src/ui/ProfitSummary.js'],
  ['src/components/RealProfitProjection.js', 'src/ui/RealProfitProjection.js'],
  ['src/components/BotActivityFeed.js', 'src/ui/BotActivityFeed.js'],
  ['src/components/DailyPerformance.js', 'src/ui/DailyPerformance.js'],
  ['src/components/DailyPerformance.css', 'src/ui/DailyPerformance.css'],
  ['src/components/SignalTable.js', 'src/ui/SignalTable.js'],
  ['src/components/Dashboard.js', 'src/ui/Dashboard.js'],
  ['src/components/PilotStatusBanner.js', 'src/ui/PilotStatusBanner.js'],

  // 🌍 Hooks & Context
  ['src/hooks/useBinancePrices.js', 'src/hooks/useBinancePrices.js'],
  ['src/context/PortfolioContext.js', 'src/context/PortfolioContext.js'],
  ['src/context/fearGreedIndex.js', 'src/context/fearGreedIndex.js'],

  // 🧪 Tests & Utilities
  ['src/test/testIndicators.js', 'src/test/testIndicators.js'],
  ['src/services/botService.js', 'src/tools/botService.js'],
  ['src/analysis/trackOutcome.js', 'src/tools/trackOutcome.js'],
  ['src/data/updatePriceHistory.js', 'src/tools/updatePriceHistory.js'],
  ['simulator.js', 'scripts/simulator.js'],
  ['macd.js', null],
  ['verifyImportIntegrity.js', 'scripts/verifyImportIntegrity.js'],
  ['scanIntegrity.js', 'scripts/scanIntegrity.js'],
  ['cleanupStructure.js', 'scripts/cleanupStructure.js'],
  ['checkBotSync.js', 'scripts/checkBotSync.js'],
  ['verifyImportCapitalization.js', 'scripts/verifyImportCapitalization.js']
];

moves.forEach(([src, dest]) => {
  if (src && fs.existsSync(src)) {
    if (dest) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.renameSync(src, dest);
      console.log(`✅ Moved: ${src} → ${dest}`);
    } else {
      fs.unlinkSync(src);
      console.log(`🗑️ Removed duplicate: ${src}`);
    }
  }
});
