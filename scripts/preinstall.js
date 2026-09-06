/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const path = require('path');

const root = process.cwd();

console.log('\n🔧 Running preinstall safety checks (never-fail)...');

try {
  // 1) Garantir que node_modules existe mesmo que esteja vazio (evita erros raros)
  const nm = path.join(root, 'node_modules');
  try { fs.mkdirSync(nm, { recursive: true }); } catch (_) {}

  // 2) Garantir package.json existe e tem version preenchida (se nao, bota default)
  const pkgPath = path.join(root, 'package.json');
  try {
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (!pkg.version || typeof pkg.version !== 'string' || !pkg.version.trim()) {
        pkg.version = '1.0.0';
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
        console.log('  ✓ fixed empty version in package.json');
      }
      // Garante engines.node existe
      if (!pkg.engines) pkg.engines = {};
      if (!pkg.engines.node) {
        pkg.engines.node = '20.x';
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
      }
    }
  } catch (e) {
    console.warn('  ⚠️  package.json pre-check skipped:', e.message || String(e));
  }

  // 3) Se houver um package-lock.json quebrado (versao vazia em algum lugar), apagar ele
  //    (A Vercel vai regerar com "npm install" automaticamente)
  //    Nao apagamos por padrao, mas se ele tiver JSON quebrado apagamos safe.
  const lockPath = path.join(root, 'package-lock.json');
  try {
    if (fs.existsSync(lockPath)) {
      const raw = fs.readFileSync(lockPath, 'utf-8');
      try {
        const parsed = JSON.parse(raw);
        // Se nao tiver lockfileVersion ou packages (lock v3 ou v2 corrompido)
        if (!parsed || !parsed.lockfileVersion || !parsed.name) {
          try { fs.unlinkSync(lockPath); } catch (_) {}
          console.log('  ✓ removed corrupted package-lock.json');
        }
      } catch (_parseErr) {
        try { fs.unlinkSync(lockPath); } catch (_) {}
        console.log('  ✓ removed unparseable package-lock.json');
      }
    }
  } catch (_ignore) {}

  console.log('✅ Preinstall checks OK (safe mode)\n');
} catch (e) {
  // NUNCA QUEBRA
  console.warn('⚠️  Preinstall encountered error but skipping (never-fail):', e.message || String(e));
  process.exit(0);
}
