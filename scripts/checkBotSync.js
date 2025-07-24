import fs from 'fs'
import path from 'path'

const checklist = [
  'trade-bot.js',
  '.env',
  'data/history.json',
  'runtime/config.js',
  'runtime/logs/',
  'src/config/riskProfile.js',
  'src/utils/logger.js',
  'src/strategy/fearAwareEmaReversal.js',
  'src/strategy/strategyTuner.js',
  'src/manager/portfolioManager.js',
  'src/manager/positionManager.js',
  'src/risk/riskManager.js',
  'src/indicators/rsi.js',
  'src/indicators/macd.js',
  'src/indicators/emaCross.js'
]

console.log('\n🧪 Verificando estructura de Bot My Wallet:\n')

for (const item of checklist) {
  const isFolder = item.endsWith('/')
  const exists = isFolder
    ? fs.existsSync(path.resolve(item))
    : fs.existsSync(path.resolve(item))

  const status = exists ? '✅' : '❌'
  console.log(`${status} ${item}`)
}

console.log('\n📦 Verificación completada.\n')
