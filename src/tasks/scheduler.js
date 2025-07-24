import cron from 'node-cron';
import { runTestCycle } from './startTestnet.js';
import { generatePerformanceSummary } from '../analytics/performanceSummary.js';
import { autoLearnFromHistory } from '../ai/autoLearn.js'; // ✅ integración de aprendizaje

console.log('🟢 Scheduler activo: BotMyWallet ejecutará ciclos, resúmenes y aprendizaje táctico...');

// 🕒 Ciclo operativo cada 15 minutos
cron.schedule('*/15 * * * *', () => {
  console.log('🚀 Ejecutando ciclo automático — cada 15 minutos');
  runTestCycle();
});

// 📊 Resumen de rendimiento cada hora
cron.schedule('0 * * * *', () => {
  console.log('📘 Generando resumen táctico — cada hora');
  generatePerformanceSummary();
});

// 🧠 Aprendizaje estratégico cada 30 minutos
cron.schedule('30 * * * *', () => {
  console.log('🧠 Activando autoaprendizaje del mercado');
  autoLearnFromHistory();
});