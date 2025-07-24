import fs from 'node:fs'
import path from 'node:path'

/**
 * Registra entrada de texto en bitácora por fecha
 * @param {string} entry - Texto a guardar
 */
export function logEntry(entry) {
  const today = new Date().toISOString().slice(0, 10)
  const filePath = path.resolve(`runtime/logs/log-${today}.txt`)
  const timestamp = new Date().toISOString()
  const logText = `\n[${timestamp}] ${entry}`

  fs.appendFileSync(filePath, logText)
}
