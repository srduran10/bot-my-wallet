"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWallet = getWallet;
exports.updateWallet = updateWallet;
exports.setWalletAmount = setWalletAmount;
exports.hasEnoughCapital = hasEnoughCapital;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const walletPath = path_1.default.resolve('src/data/wallet.json');
function getWallet() {
    try {
        const data = JSON.parse(fs_1.default.readFileSync(walletPath));
        return data;
    }
    catch (err) {
        console.warn('🟠 wallet.json no encontrado. Generando archivo inicial...');
        const initialWallet = { current: 15.19 };
        fs_1.default.writeFileSync(walletPath, JSON.stringify(initialWallet, null, 2));
        return initialWallet;
    }
}
function updateWallet(delta) {
    const wallet = getWallet();
    wallet.current = parseFloat((wallet.current + delta).toFixed(2));
    fs_1.default.writeFileSync(walletPath, JSON.stringify(wallet, null, 2));
    console.log(`💰 Capital ajustado:

{wallet.current} actualizado ${wallet.lastupdated}`);
}
function setWalletAmount(newAmount) {
    const wallet = { current: parseFloat(newAmount.toFixed(2)) };
    fs_1.default.writeFileSync(walletPath, JSON.stringify(wallet, null, 2));
    console.log(`🔧 Capital manual establecido: 

{wallet.current}`);
}
function hasEnoughCapital(minRequired = 10) {
    const wallet = getWallet();
    return wallet.current >= minRequired;
}
