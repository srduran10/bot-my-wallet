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
const tf = __importStar(require("@tensorflow/tfjs-node"));
/**
 * Simula una evaluación de señal antes de ejecutar orden
 * Puedes integrarlo dentro de tu estrategia o dashboard
 */
async function loadModel(path = 'model/signalPredictor') {
    try {
        const model = await tf.loadLayersModel(`file://${path}/model.json`);
        return model;
    }
    catch (err) {
        console.error(`❌ Modelo no encontrado en ${path}`);
        return null;
    }
}
async function evaluate({ rsi, macd, sentiment }) {
    const model = await loadModel();
    if (!model)
        return;
    const input = tf.tensor2d([[rsi, macd, sentiment]]);
    const prediction = model.predict(input);
    const result = await prediction.data();
    const probability = (result[0] * 100).toFixed(2);
    console.log(`🤖 Señal evaluada: RSI ${rsi}, MACD ${macd}, Sentimiento ${sentiment}`);
    console.log(`🔍 Probabilidad de éxito estimada: ${probability}%`);
}
const signalSample = {
    rsi: 77.5,
    macd: 0.02,
    sentiment: 26 // Fear
};
evaluate(signalSample);
