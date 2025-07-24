import fs from 'fs'
import path from 'path'

const srcDir = path.resolve('src')

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

function checkImports() {
  const allFiles = getAllFiles(srcDir)
  const issues = { capitalization: [], missing: [] }

  for (const file of allFiles) {
    const imports = extractRelativeImports(file)
    for (const { importPath } of imports) {
      const resolvedPath = path.resolve(path.dirname(file), importPath)
      const dir = path.dirname(resolvedPath)
      const target = path.basename(resolvedPath)

      if (!fs.existsSync(resolvedPath)) {
        const realFiles = fs.existsSync(dir) ? fs.readdirSync(dir) : []
        const match = realFiles.find(name => name.toLowerCase() === target.toLowerCase())

        if (match && match !== target) {
          issues.capitalization.push({
            importer: file.replace(srcDir + '/', ''),
            reference: importPath,
            actual: match
          })
        } else {
          issues.missing.push({
            importer: file.replace(srcDir + '/', ''),
            reference: importPath
          })
        }
      }
    }
  }

  if (!issues.capitalization.length && !issues.missing.length) {
    console.log('\n✅ Todos los imports están íntegros y bien escritos.\n')
    return
  }

  if (issues.capitalization.length) {
    console.log('\n🛑 Conflictos de capitalización detectados:\n')
    for (const { importer, reference, actual } of issues.capitalization) {
      console.log(`• En ${importer}: importó '${reference}' pero el archivo real es '${actual}'`)
    }
  }

  if (issues.missing.length) {
    console.log('\n🚫 Imports rotos (archivo no existe):\n')
    for (const { importer, reference } of issues.missing) {
      console.log(`• En ${importer}: '${reference}' no existe`)
    }
  }

  console.log('\n📦 Corrige estos errores para evitar fallos en producción.\n')
}

checkImports()
