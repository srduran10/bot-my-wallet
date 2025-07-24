// Ejecuta con:
// Diagnóstico: node cleanupStructure.js
// Simulado:    node cleanupStructure.js --fix --dry
// Activo:      node cleanupStructure.js --fix

import fs from 'fs'
import path from 'path'
import os from 'os'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import crypto from 'crypto'
import zlib from 'zlib'
import { createGzip } from 'zlib'
import { pipeline } from 'stream'
import { promisify } from 'util'

const pipe = promisify(pipeline)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, 'src')
const args = process.argv.slice(2)
const APPLY_FIXES = args.includes('--fix')
const DRY_RUN = args.includes('--dry')

// 🧠 Utilidades base
function getAllJSFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) getAllJSFiles(fullPath, fileList)
    else if (entry.isFile() && entry.name.endsWith('.js')) fileList.push(fullPath)
  }
  return fileList
}

function readFileContent(filePath) {
  return fs.readFileSync(filePath, 'utf-8')
}

function hashContent(content) {
  return crypto.createHash('md5').update(content).digest('hex')
}

function backupProject() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupDir = path.resolve(__dirname, 'backup')
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir)
  const zipPath = path.join(backupDir, `botmywallet_backup_${timestamp}.zip`)
  const zipCmd =
    os.platform() === 'win32'
      ? `powershell Compress-Archive -Path src/* -DestinationPath ${zipPath}`
      : `zip -r "${zipPath}" src/ > /dev/null`

  try {
    execSync(zipCmd, { stdio: 'ignore' })
    console.log(`💾 Copia de seguridad creada: ${zipPath}\n`)
  } catch (err) {
    console.log('⚠️ Error al crear copia de seguridad.')
  }
}

function getImportMap() {
  const importMap = new Set()
  const allFiles = getAllJSFiles(ROOT)

  allFiles.forEach((file) => {
    const content = readFileContent(file)
    const regex = /import .* from ['"](.+)['"]/g
    const matches = [...content.matchAll(regex)]
    matches.forEach((m) => {
      let relative = m[1]
      if (relative.startsWith('.')) {
        const base = path.dirname(file)
        const target = path.resolve(base, relative + (relative.endsWith('.js') ? '' : '.js'))
        importMap.add(path.normalize(target))
      }
    })
  })
  return importMap
}

// 🚦 Auditor + Fixer
function runCleanupScan() {
  console.log('\n🧹 Auditoría estructural BotMyWallet\n')
  if (APPLY_FIXES && !DRY_RUN) backupProject()

  const usedImports = getImportMap()
  const allFiles = getAllJSFiles(ROOT)
  const seenHashes = {}
  const duplicateGroups = {}

  let removed = 0
  let moved = 0

  allFiles.forEach((file) => {
    const normPath = path.normalize(file)
    const relPath = path.relative(ROOT, normPath)
    const isUsed = usedImports.has(normPath)

    const content = readFileContent(normPath)
    const hash = hashContent(content)

    // Duplicados
    if (seenHashes[hash]) {
      duplicateGroups[hash] = duplicateGroups[hash] || [seenHashes[hash]]
      duplicateGroups[hash].push(normPath)

      if (APPLY_FIXES && !DRY_RUN) {
        try {
          fs.unlinkSync(normPath)
          console.log(`🗑️ Eliminado duplicado: ${relPath}`)
          removed++
        } catch (err) {
          console.log(`❌ Error al eliminar: ${relPath}`)
        }
      } else if (APPLY_FIXES && DRY_RUN) {
        console.log(`💡 Simular eliminación duplicado: ${relPath}`)
      } else {
        console.log(`🔁 Duplicado detectado: ${relPath}`)
      }
    } else {
      seenHashes[hash] = normPath
    }

    // Registro de uso
    if (!isUsed) {
      if (APPLY_FIXES && !DRY_RUN) {
        try {
          fs.unlinkSync(normPath)
          console.log(`🗑️ Eliminado no usado: ${relPath}`)
          removed++
        } catch {
          console.log(`❌ Error al eliminar no usado: ${relPath}`)
        }
      } else if (APPLY_FIXES && DRY_RUN) {
        console.log(`💡 Simular eliminación no usado: ${relPath}`)
      } else {
        console.log(`⚠️ No usado: ${relPath}`)
      }
    } else {
      console.log(`✅ Usado: ${relPath}`)
    }
  })

  // Instalación de dependencias
  const deps = ['binance-api-node']
  deps.forEach((dep) => {
    try {
      require.resolve(dep)
      console.log(`📦 Dependencia instalada: ${dep}`)
    } catch {
      if (APPLY_FIXES && !DRY_RUN) {
        console.log(`⬇️ Instalando ${dep}...`)
        execSync(`npm install ${dep}`, { stdio: 'inherit' })
      } else {
        console.log(`💡 Dependencia faltante: ${dep}`)
      }
    }
  })

  console.log(`\n📦 Archivos eliminados: ${removed}`)
  console.log(`📋 Limpieza completada ${DRY_RUN ? '(simulada)' : ''}.\n`)
}

runCleanupScan()
