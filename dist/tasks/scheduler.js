"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const startTestnet_js_1 = require("./startTestnet.js");
const performanceSummary_js_1 = require("../analytics/performanceSummary.js");
const autoLearn_js_1 = require("../ai/autoLearn.js"); // ✅ integración de aprendizaje
console.log('🟢 Scheduler activo: BotMyWallet ejecutará ciclos, resúmenes y aprendizaje táctico...');
// 🕒 Ciclo operativo cada 15 minutos
node_cron_1.default.schedule('*/15 * * * *', () => {
    console.log('🚀 Ejecutando ciclo automático — cada 15 minutos');
    (0, startTestnet_js_1.runTestCycle)();
});
// 📊 Resumen de rendimiento cada hora
node_cron_1.default.schedule('0 * * * *', () => {
    console.log('📘 Generando resumen táctico — cada hora');
    (0, performanceSummary_js_1.generatePerformanceSummary)();
});
// 🧠 Aprendizaje estratégico cada 30 minutos
node_cron_1.default.schedule('30 * * * *', () => {
    console.log('🧠 Activando autoaprendizaje del mercado');
    (0, autoLearn_js_1.autoLearnFromHistory)();
});
