import fs from 'fs';
import path from 'path';

const walletPath = path.resolve('src/data/wallet.json');

export function getWallet() {
  try {
    const data = JSON.parse(fs.readFileSync(walletPath));
    return data;
  } catch (err) {
    console.warn('🟠 wallet.json no encontrado. Generando archivo inicial...');
    const initialWallet = { current: 15.19 };
    fs.writeFileSync(walletPath, JSON.stringify(initialWallet, null, 2));
    return initialWallet;
  }
}

export function updateWallet(delta) {
  const wallet = getWallet();
  wallet.current = parseFloat((wallet.current + delta).toFixed(2));
  fs.writeFileSync(walletPath, JSON.stringify(wallet, null, 2));
  console.log(`💰 Capital ajustado:

{wallet.current} actualizado ${wallet.lastupdated}`);
}

export function setWalletAmount(newAmount) {
  const wallet = { current: parseFloat(newAmount.toFixed(2)) };
  fs.writeFileSync(walletPath, JSON.stringify(wallet, null, 2));
  console.log(`🔧 Capital manual establecido: 

{wallet.current}`);
}

export function hasEnoughCapital(minRequired = 10) {
  const wallet = getWallet();
  return wallet.current >= minRequired;
}