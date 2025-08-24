#!/usr/bin/env node

/**
 * Script para configurar e verificar ambiente do Google Cloud
 * Uso: node scripts/google-cloud-setup.js
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
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(message, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

function logSection(message) {
  log(`\n${'-'.repeat(40)}`, 'blue');
  log(message, 'bright');
  log(`${'-'.repeat(40)}`, 'blue');
}

function checkEnvFile() {
  logSection('Verificando arquivo .env.local');
  
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    log('❌ Arquivo .env.local não encontrado', 'red');
    log('   Crie o arquivo .env.local na raiz do projeto', 'yellow');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Verificar variáveis do Google Cloud
  const requiredVars = [
    'VITE_GCS_BUCKET_NAME',
    'VITE_GCS_PROJECT_ID',
    'VITE_GCS_API_KEY'
  ];
  
  const optionalVars = [
    'GOOGLE_CLOUD_PROJECT_ID',
    'GOOGLE_CLOUD_KEY_FILE'
  ];
  
  let allRequired = true;
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      log(`✅ ${varName}`, 'green');
    } else {
      log(`❌ ${varName} - FALTANDO`, 'red');
      allRequired = false;
    }
  });
  
  optionalVars.forEach(varName => {
    if (envContent.includes(varName)) {
      log(`✅ ${varName} (opcional)`, 'green');
    } else {
      log(`⚠️  ${varName} - Não configurado (opcional)`, 'yellow');
    }
  });
  
  return allRequired;
}

function checkPackageJson() {
  logSection('Verificando dependências do Google Cloud');
  
  const packagePath = path.join(__dirname, '..', 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    log('❌ package.json não encontrado', 'red');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = [
    '@google-cloud/storage',
    'googleapis'
  ];
  
  const optionalDeps = [
    'multer',
    'express'
  ];
  
  let allRequired = true;
  
  requiredDeps.forEach(dep => {
    if (dependencies[dep]) {
      log(`✅ ${dep}@${dependencies[dep]}`, 'green');
    } else {
      log(`❌ ${dep} - FALTANDO`, 'red');
      allRequired = false;
    }
  });
  
  optionalDeps.forEach(dep => {
    if (dependencies[dep]) {
      log(`✅ ${dep}@${dependencies[dep]} (opcional)`, 'green');
    } else {
      log(`⚠️  ${dep} - Não instalado (opcional)`, 'yellow');
    }
  });
  
  return allRequired;
}

function checkConfigFiles() {
  logSection('Verificando arquivos de configuração');
  
  const files = [
    'src/services/googleCloud.ts',
    'src/components/Admin/VideoManager.tsx',
    'GOOGLE_CLOUD_SETUP.md'
  ];
  
  let allExist = true;
  
  files.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      log(`✅ ${file}`, 'green');
    } else {
      log(`❌ ${file} - NÃO ENCONTRADO`, 'red');
      allExist = false;
    }
  });
  
  return allExist;
}

function checkFolderStructure() {
  logSection('Verificando estrutura de pastas');
  
  const folders = [
    'src/services',
    'src/components/Admin',
    'scripts'
  ];
  
  let allExist = true;
  
  folders.forEach(folder => {
    const folderPath = path.join(__dirname, '..', folder);
    if (fs.existsSync(folderPath)) {
      log(`✅ ${folder}/`, 'green');
    } else {
      log(`❌ ${folder}/ - NÃO ENCONTRADO`, 'red');
      allExist = false;
    }
  });
  
  return allExist;
}

function generateReport(results) {
  logHeader('RELATÓRIO DE CONFIGURAÇÃO GOOGLE CLOUD');
  
  const { envOk, depsOk, configOk, foldersOk } = results;
  
  log('\n📊 RESUMO:', 'bright');
  log(`Variáveis de ambiente: ${envOk ? '✅' : '❌'}`, envOk ? 'green' : 'red');
  log(`Dependências: ${depsOk ? '✅' : '❌'}`, depsOk ? 'green' : 'red');
  log(`Arquivos de configuração: ${configOk ? '✅' : '❌'}`, configOk ? 'green' : 'red');
  log(`Estrutura de pastas: ${foldersOk ? '✅' : '❌'}`, foldersOk ? 'green' : 'red');
  
  const overallStatus = envOk && depsOk && configOk && foldersOk;
  
  if (overallStatus) {
    log('\n🎉 SISTEMA PRONTO PARA GOOGLE CLOUD!', 'green');
    log('   Todas as configurações estão corretas.', 'green');
  } else {
    log('\n⚠️  CONFIGURAÇÕES PENDENTES', 'yellow');
    
    if (!envOk) {
      log('\n🔧 Para configurar variáveis de ambiente:', 'cyan');
      log('   1. Crie o arquivo .env.local na raiz do projeto');
      log('   2. Adicione as seguintes variáveis:');
      log('      VITE_GCS_BUCKET_NAME=seu-bucket-name');
      log('      VITE_GCS_PROJECT_ID=seu-project-id');
      log('      VITE_GCS_API_KEY=sua-api-key');
    }
    
    if (!depsOk) {
      log('\n📦 Para instalar dependências:', 'cyan');
      log('   npm install @google-cloud/storage googleapis');
    }
    
    if (!configOk) {
      log('\n📁 Arquivos de configuração ausentes', 'cyan');
      log('   Verifique se todos os arquivos necessários existem');
    }
  }
  
  log('\n📚 DOCUMENTAÇÃO:', 'bright');
  log('   - GOOGLE_CLOUD_SETUP.md - Guia completo de configuração');
  log('   - https://cloud.google.com/storage/docs - Documentação oficial');
  
  return overallStatus;
}

function main() {
  logHeader('GOOGLE CLOUD SETUP CHECKER');
  
  const results = {
    envOk: checkEnvFile(),
    depsOk: checkPackageJson(),
    configOk: checkConfigFiles(),
    foldersOk: checkFolderStructure()
  };
  
  const isReady = generateReport(results);
  
  if (isReady) {
    log('\n🚀 Próximos passos:', 'bright');
    log('   1. Configure seu projeto no Google Cloud Console');
    log('   2. Crie um bucket para armazenar os vídeos');
    log('   3. Configure as permissões de CORS');
    log('   4. Teste o upload de um vídeo');
  } else {
    log('\n🔧 Ações necessárias:', 'bright');
    log('   1. Configure as variáveis de ambiente');
    log('   2. Instale as dependências faltantes');
    log('   3. Execute este script novamente');
  }
}

main();
