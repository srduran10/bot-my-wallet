"use strict";
/**
 * Entrenamiento supervisado básico en Node.js con TensorFlow.js
 * Analiza RSI, MACD, Sentimiento y resultado para predecir efectividad de futuras señales
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const tf = __importStar(require("@tensorflow/tfjs-node"));
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
const historyPath = path_1.default.join(__dirname, '../data/history.json');
function loadHistoryData() {
    if (!fs_1.default.existsSync(historyPath)) {
        console.error('❌ No se encontró history.json');
        process.exit(1);
    }
    const rawData = JSON.parse(fs_1.default.readFileSync(historyPath));
    const dataset = [];
    for (const entry of rawData) {
        if (!entry.rsi || !entry.macd || !entry.sentiment || !entry.outcome)
            continue;
        dataset.push({
            rsi: entry.rsi,
            macd: entry.macd,
            sentiment: entry.sentiment.value, // numérico
            result: entry.outcome === 'win' ? 1 : 0
        });
    }
    return dataset;
}
function createModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 8, inputShape: [3], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 4, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });
    return model;
}
async function trainModel(model, dataset) {
    const inputs = dataset.map(d => [d.rsi, d.macd, d.sentiment]);
    const labels = dataset.map(d => d.result);
    const xs = tf.tensor2d(inputs);
    const ys = tf.tensor2d(labels, [labels.length, 1]);
    await model.fit(xs, ys, {
        epochs: 100,
        batchSize: 16,
        verbose: 0
    });
    console.log('✅ Entrenamiento completado');
}
async function run() {
    const dataset = loadHistoryData();
    if (dataset.length < 20) {
        console.error('⚠️ No hay suficientes ejemplos para entrenar (mínimo 20)');
        return;
    }
    const model = createModel();
    await trainModel(model, dataset);
    // Prueba de predicción
    const sample = tf.tensor2d([[72, -0.3, 22]]); // RSI alto, MACD bajista, Sentimiento Fear
    const prediction = model.predict(sample);
    const confidence = await prediction.data();
    console.log(`🤖 Probabilidad estimada de éxito: ${(confidence[0] * 100).toFixed(2)}%`);
}
run();
