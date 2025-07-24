import fs from 'fs'
import path from 'path'

const srcDir = path.resolve('src')

// Recoge todos los archivos JS en src/
function getAllFiles(dir, all = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, all)
    } else if (file.endsWith('.js')) {
      all.push(fullPath)
    }
  })
  return all
}

// Extrae imports relativos tipo './config/riskProfile.js'
function extractRelativeImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const regex = /import .* from ['"](\.\/[^'"]+)['"]/g
  const matches = []
  let match
  while ((match = regex.exec(content))) {
    matches.push({ filePath, importPath: match[1] })
  }
  return matches
}

// Compara si el archivo importado existe y coincide en mayúsculas
function checkCapitalization() {
  const allFiles = getAllFiles(srcDir)
  const mismatches = []

  for (const file of allFiles) {
    const imports = extractRelativeImports(file)
    for (const { importPath } of imports) {
      const resolvedPath = path.resolve(path.dirname(file), importPath)
      const dir = path.dirname(resolvedPath)
      const target = path.basename(resolvedPath)

      const realFiles = fs.readdirSync(dir)
      const match = realFiles.find(name => name.toLowerCase() === target.toLowerCase())

      if (match && match !== target) {
        mismatches.push({
          importer: file.replace(srcDir + '/', ''),
          reference: importPath,
          actual: match
        })
      }
    }
  }

  if (!mismatches.length) {
    console.log('\n✅ No hay conflictos de capitalización en tus imports.\n')
  } else {
    console.log('\n🛑 Se detectaron conflictos de capitalización:\n')
    for (const { importer, reference, actual } of mismatches) {
      console.log(`• En ${importer}: importó '${reference}' pero el archivo real es '${actual}'`)
    }
    console.log('\n📦 Corrige los nombres para evitar errores en Linux.\n')
  }
}

checkCapitalization()