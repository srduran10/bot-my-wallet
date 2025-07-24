"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEntry = logEntry;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * Registra entrada de texto en bitácora por fecha
 * @param {string} entry - Texto a guardar
 */
function logEntry(entry) {
    const today = new Date().toISOString().slice(0, 10);
    const filePath = node_path_1.default.resolve(`runtime/logs/log-${today}.txt`);
    const timestamp = new Date().toISOString();
    const logText = `\n[${timestamp}] ${entry}`;
    node_fs_1.default.appendFileSync(filePath, logText);
}
