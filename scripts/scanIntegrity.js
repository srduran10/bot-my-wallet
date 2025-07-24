// Ejecuta con: node scanIntegrity.js

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 📂 Carpeta raíz a analizar
const ROOT = path.resolve(__dirname, 'src')

// 📦 Archivos clave esperados
const expectedModules = [
  'strategy/strategyTuner.js',
  'strategy/indicators/rsi.js',
  'strategy/indicators/macd.js',
  'utils/logger.js',
  'utils/binanceClient.js',
  'context/fearGreedIndex.js',
  'data/priceHistory.js'
]

// 🧠 Utilidad para validar existencia
function validateFileExists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath))
}

// 🔍 Escaneo de imports dentro de un archivo
function scanImports(filePath) {
  const fullPath = path.join(ROOT, filePath)
  if (!fs.existsSync(fullPath)) return []

  const content = fs.readFileSync(fullPath, 'utf-8')
  const regex = /import .* from ['"](.+)['"]/g
  const matches = [...content.matchAll(regex)]

  return matches.map((m) => ({
    from: filePath,
    importPath: m[1],
    resolvedPath: resolveImport(filePath, m[1])
  }))
}

// 📁 Resolución de ruta absoluta
function resolveImport(fromFile, importPath) {
  const fromDir = path.dirname(path.join(ROOT, fromFile))
  return path.resolve(fromDir, importPath)
}

// 🚦 Validación completa
function runIntegrityScan() {
  console.log('\n🔍 Escaneando integridad estructural...\n')

  // 1️⃣ Verificar archivos esperados
  expectedModules.forEach((mod) => {
    const ok = validateFileExists(mod)
    const status = ok ? '✅' : '❌'
    console.log(`${status} ${mod} ${ok ? '' : '→ Archivo faltante'}`)
  })

  // 2️⃣ Escanear imports en archivos estratégicos
  const filesToScan = expectedModules.filter((f) => f.endsWith('.js') && validateFileExists(f))
  for (const f of filesToScan) {
    const imports = scanImports(f)
    for (const imp of imports) {
      const target = imp.resolvedPath
      const exists = fs.existsSync(target)
      const label = exists ? '✅ Ruta válida' : '❌ Ruta rota'
      console.log(`  ${label} import en ${imp.from} → ${imp.importPath}`)
    }
  }

  console.log('\n📋 Revisión completada.\n')
}

runIntegrityScan()