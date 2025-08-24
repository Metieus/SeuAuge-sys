#!/usr/bin/env node

/**
 * Script para verificar configuração de autenticação
 * Uso: node scripts/auth-check.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${'='.repeat(50)}`, 'cyan');
  log(message, 'bright');
  log(`${'='.repeat(50)}`, 'cyan');
}

function logSection(message) {
  log(`\n${'-'.repeat(30)}`, 'blue');
  log(message, 'blue');
  log(`${'-'.repeat(30)}`, 'blue');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Verificar se arquivo .env.local existe
function checkEnvFile() {
  logSection('Verificando arquivo de ambiente');
  
  const envPath = path.join(process.cwd(), '.env.local');
  const envExists = fs.existsSync(envPath);
  
  if (envExists) {
    logSuccess('Arquivo .env.local encontrado');
    
    // Ler e verificar conteúdo
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];
    
    const optionalVars = [
      'VITE_ADMIN_EMAIL',
      'VITE_DEV_MODE',
      'VITE_FIREBASE_API_KEY'
    ];
    
    logInfo('Verificando variáveis obrigatórias:');
    requiredVars.forEach(varName => {
      const hasVar = lines.some(line => line.startsWith(varName + '='));
      if (hasVar) {
        logSuccess(`${varName} está configurada`);
      } else {
        logError(`${varName} não está configurada`);
      }
    });
    
    logInfo('Verificando variáveis opcionais:');
    optionalVars.forEach(varName => {
      const hasVar = lines.some(line => line.startsWith(varName + '='));
      if (hasVar) {
        logSuccess(`${varName} está configurada`);
      } else {
        logWarning(`${varName} não está configurada (opcional)`);
      }
    });
    
    return true;
  } else {
    logError('Arquivo .env.local não encontrado');
    logInfo('Crie o arquivo .env.local com as seguintes variáveis:');
    logInfo('VITE_SUPABASE_URL=https://seu-projeto.supabase.co');
    logInfo('VITE_SUPABASE_ANON_KEY=sua-chave-anon');
    return false;
  }
}

// Verificar package.json
function checkPackageJson() {
  logSection('Verificando dependências');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packagePath)) {
    logError('package.json não encontrado');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Verificar dependências do Supabase
  const supabaseDeps = ['@supabase/supabase-js'];
  const missingDeps = [];
  
  supabaseDeps.forEach(dep => {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
      missingDeps.push(dep);
    }
  });
  
  if (missingDeps.length === 0) {
    logSuccess('Dependências do Supabase encontradas');
  } else {
    logError(`Dependências faltando: ${missingDeps.join(', ')}`);
    logInfo('Execute: npm install @supabase/supabase-js');
  }
  
  return missingDeps.length === 0;
}

// Verificar arquivos de configuração
function checkConfigFiles() {
  logSection('Verificando arquivos de configuração');
  
  const filesToCheck = [
    'src/lib/supabaseClient.ts',
    'src/contexts/AuthContext.tsx',
    'supabase-security-policies.sql'
  ];
  
  let allFilesExist = true;
  
  filesToCheck.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      logSuccess(`${filePath} encontrado`);
    } else {
      logError(`${filePath} não encontrado`);
      allFilesExist = false;
    }
  });
  
  return allFilesExist;
}

// Verificar estrutura de pastas
function checkFolderStructure() {
  logSection('Verificando estrutura de pastas');
  
  const foldersToCheck = [
    'src/components/Auth',
    'src/lib',
    'src/contexts',
    'src/services'
  ];
  
  let allFoldersExist = true;
  
  foldersToCheck.forEach(folderPath => {
    const fullPath = path.join(process.cwd(), folderPath);
    if (fs.existsSync(fullPath)) {
      logSuccess(`${folderPath} encontrado`);
    } else {
      logError(`${folderPath} não encontrado`);
      allFoldersExist = false;
    }
  });
  
  return allFoldersExist;
}

// Verificar scripts npm
function checkNpmScripts() {
  logSection('Verificando scripts npm');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packagePath)) {
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const scripts = packageJson.scripts || {};
  
  const requiredScripts = ['dev', 'build', 'lint'];
  const missingScripts = [];
  
  requiredScripts.forEach(script => {
    if (scripts[script]) {
      logSuccess(`Script "${script}" encontrado`);
    } else {
      missingScripts.push(script);
    }
  });
  
  if (missingScripts.length > 0) {
    logWarning(`Scripts faltando: ${missingScripts.join(', ')}`);
  }
  
  return missingScripts.length === 0;
}

// Gerar relatório
function generateReport(results) {
  logHeader('RELATÓRIO DE VERIFICAÇÃO');
  
  const totalChecks = Object.keys(results).length;
  const passedChecks = Object.values(results).filter(Boolean).length;
  const failedChecks = totalChecks - passedChecks;
  
  log(`\n📊 Resumo:`, 'bright');
  log(`Total de verificações: ${totalChecks}`, 'blue');
  log(`Verificações aprovadas: ${passedChecks}`, 'green');
  log(`Verificações falharam: ${failedChecks}`, failedChecks > 0 ? 'red' : 'green');
  
  if (failedChecks === 0) {
    log(`\n🎉 Todas as verificações passaram!`, 'green');
    log(`O sistema de autenticação está configurado corretamente.`, 'green');
  } else {
    log(`\n⚠️  Algumas verificações falharam.`, 'yellow');
    log(`Consulte o guia AUTH_SETUP_GUIDE.md para correções.`, 'yellow');
  }
  
  // Recomendações
  log(`\n📋 Próximos passos:`, 'bright');
  if (!results.envFile) {
    log('1. Configure o arquivo .env.local com suas credenciais do Supabase', 'yellow');
  }
  if (!results.dependencies) {
    log('2. Execute: npm install para instalar dependências faltantes', 'yellow');
  }
  if (results.envFile && results.dependencies) {
    log('1. Execute: npm run dev para testar a aplicação', 'green');
    log('2. Acesse: http://localhost:5173 para verificar o funcionamento', 'green');
  }
  
  log(`\n📖 Para mais informações, consulte:`, 'bright');
  log('- AUTH_SETUP_GUIDE.md', 'blue');
  log('- SECURITY_AUDIT_REPORT.md', 'blue');
  log('- README.md', 'blue');
}

// Função principal
function main() {
  logHeader('VERIFICAÇÃO DE CONFIGURAÇÃO DE AUTENTICAÇÃO');
  
  const results = {
    envFile: checkEnvFile(),
    dependencies: checkPackageJson(),
    configFiles: checkConfigFiles(),
    folderStructure: checkFolderStructure(),
    npmScripts: checkNpmScripts()
  };
  
  generateReport(results);
  
  // Exit code
  const hasFailures = Object.values(results).some(result => !result);
  process.exit(hasFailures ? 1 : 0);
}

// Executar se chamado diretamente
main();
