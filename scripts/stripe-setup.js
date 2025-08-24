#!/usr/bin/env node

/**
 * Script para configurar e verificar ambiente do Stripe
 * Uso: node scripts/stripe-setup.js
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
  log(message, 'blue');
  log(`${'-'.repeat(40)}`, 'blue');
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

function logStep(message) {
  log(`🔧 ${message}`, 'magenta');
}

// Verificar variáveis de ambiente do Stripe
function checkStripeEnvVars() {
  logSection('Verificando variáveis de ambiente do Stripe');
  
  const envPath = path.join(process.cwd(), '.env.local');
  const envExists = fs.existsSync(envPath);
  
  if (!envExists) {
    logError('Arquivo .env.local não encontrado');
    logInfo('Crie o arquivo .env.local primeiro');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  const stripeVars = [
    'VITE_STRIPE_PUBLIC_KEY',
    'VITE_API_URL',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];
  
  const results = {};
  
  stripeVars.forEach(varName => {
    const hasVar = lines.some(line => line.startsWith(varName + '='));
    const line = lines.find(line => line.startsWith(varName + '='));
    const value = line ? line.split('=')[1]?.trim() : null;
    
    if (hasVar && value && value !== 'your_stripe_key' && value !== 'your_api_url') {
      logSuccess(`${varName} configurada`);
      results[varName] = true;
    } else if (hasVar) {
      logWarning(`${varName} presente mas não configurada corretamente`);
      results[varName] = false;
    } else {
      logError(`${varName} não encontrada`);
      results[varName] = false;
    }
  });
  
  return results;
}

// Verificar arquivos de configuração do Stripe
function checkStripeFiles() {
  logSection('Verificando arquivos de configuração do Stripe');
  
  const filesToCheck = [
    'src/services/stripe.ts',
    'stripe-backend-example.js',
    'STRIPE_SETUP.md'
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

// Verificar configuração dos planos
function checkPlanConfiguration() {
  logSection('Verificando configuração dos planos');
  
  const stripeServicePath = path.join(process.cwd(), 'src/services/stripe.ts');
  if (!fs.existsSync(stripeServicePath)) {
    logError('Arquivo stripe.ts não encontrado');
    return false;
  }
  
  const content = fs.readFileSync(stripeServicePath, 'utf8');
  
  // Verificar se os Price IDs estão configurados
  const priceIds = [
    'price_1QOtW8KOVEOQAyMUqg7NKQAB', // Plano Base
    'price_1QOtW8KOVEOQAyMUqg7NKQAC', // Plano Escalada
    'price_1QOtW8KOVEOQAyMUqg7NKQAD'  // Plano Auge
  ];
  
  let allPlansConfigured = true;
  
  priceIds.forEach(priceId => {
    if (content.includes(priceId)) {
      logSuccess(`Price ID ${priceId} configurado`);
    } else {
      logError(`Price ID ${priceId} não encontrado`);
      allPlansConfigured = false;
    }
  });
  
  return allPlansConfigured;
}

// Verificar dependências do Stripe
function checkStripeDependencies() {
  logSection('Verificando dependências do Stripe');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packagePath)) {
    logError('package.json não encontrado');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Verificar dependências do Stripe
  const stripeDeps = ['stripe'];
  const missingDeps = [];
  
  stripeDeps.forEach(dep => {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
      missingDeps.push(dep);
    }
  });
  
  if (missingDeps.length === 0) {
    logSuccess('Dependências do Stripe encontradas');
  } else {
    logWarning(`Dependências faltando: ${missingDeps.join(', ')}`);
    logInfo('Execute: npm install stripe');
  }
  
  return missingDeps.length === 0;
}

// Verificar configuração de CORS para Stripe
function checkCorsConfiguration() {
  logSection('Verificando configuração de CORS');
  
  const corsPath = path.join(process.cwd(), 'cors.json');
  if (!fs.existsSync(corsPath)) {
    logWarning('Arquivo cors.json não encontrado');
    return false;
  }
  
  const corsConfig = JSON.parse(fs.readFileSync(corsPath, 'utf8'));
  
  if (corsConfig.origin && corsConfig.origin.includes('localhost:5173')) {
    logSuccess('CORS configurado para desenvolvimento');
  } else {
    logWarning('CORS pode precisar de configuração para produção');
  }
  
  return true;
}

// Gerar template de configuração
function generateStripeTemplate() {
  logSection('Gerando template de configuração');
  
  const template = `# Configuração do Stripe
# Copie este conteúdo para seu arquivo .env.local

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_test_SUA_CHAVE_PUBLICA_AQUI
VITE_API_URL=http://localhost:3000/api

# Backend Stripe (para o servidor)
STRIPE_SECRET_KEY=sk_test_SUA_CHAVE_SECRETA_AQUI
STRIPE_WEBHOOK_SECRET=whsec_SEU_WEBHOOK_SECRET_AQUI

# Configuração de ambiente
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Para produção, use:
# VITE_STRIPE_PUBLIC_KEY=pk_live_SUA_CHAVE_PUBLICA_AQUI
# VITE_API_URL=https://sua-api.com/api
# STRIPE_SECRET_KEY=sk_live_SUA_CHAVE_SECRETA_AQUI
# STRIPE_WEBHOOK_SECRET=whsec_SEU_WEBHOOK_SECRET_AQUI
`;
  
  const templatePath = path.join(process.cwd(), 'stripe-config-template.env');
  fs.writeFileSync(templatePath, template);
  
  logSuccess('Template de configuração criado: stripe-config-template.env');
  logInfo('Copie as variáveis para seu arquivo .env.local');
  
  return true;
}

// Gerar relatório
function generateReport(results) {
  logHeader('RELATÓRIO DE CONFIGURAÇÃO DO STRIPE');
  
  const totalChecks = Object.keys(results).length;
  const passedChecks = Object.values(results).filter(Boolean).length;
  const failedChecks = totalChecks - passedChecks;
  
  log(`\n📊 Resumo:`, 'bright');
  log(`Total de verificações: ${totalChecks}`, 'blue');
  log(`Verificações aprovadas: ${passedChecks}`, 'green');
  log(`Verificações falharam: ${failedChecks}`, failedChecks > 0 ? 'red' : 'green');
  
  if (failedChecks === 0) {
    log(`\n🎉 Stripe configurado corretamente!`, 'green');
    log(`O sistema de pagamentos está pronto para uso.`, 'green');
  } else {
    log(`\n⚠️  Algumas configurações precisam ser ajustadas.`, 'yellow');
  }
  
  // Próximos passos
  log(`\n📋 Próximos passos:`, 'bright');
  
  if (!results.envVars || Object.values(results.envVars).some(v => !v)) {
    log('1. Configure as variáveis de ambiente do Stripe', 'yellow');
    log('2. Obtenha suas chaves no Dashboard do Stripe', 'yellow');
  }
  
  if (!results.dependencies) {
    log('3. Instale as dependências: npm install stripe', 'yellow');
  }
  
  if (!results.plans) {
    log('4. Configure os Price IDs dos planos no Stripe Dashboard', 'yellow');
  }
  
  if (results.envVars && Object.values(results.envVars).every(v => v)) {
    log('1. Teste o checkout: npm run dev', 'green');
    log('2. Configure webhooks no Dashboard do Stripe', 'green');
    log('3. Teste pagamentos em modo de teste', 'green');
  }
  
  log(`\n📖 Para mais informações, consulte:`, 'bright');
  log('- STRIPE_SETUP.md', 'blue');
  log('- stripe-backend-example.js', 'blue');
  log('- Dashboard do Stripe: https://dashboard.stripe.com', 'blue');
}

// Função principal
function main() {
  logHeader('CONFIGURAÇÃO DO AMBIENTE STRIPE');
  
  const results = {
    envVars: checkStripeEnvVars(),
    files: checkStripeFiles(),
    plans: checkPlanConfiguration(),
    dependencies: checkStripeDependencies(),
    cors: checkCorsConfiguration()
  };
  
  // Gerar template se necessário
  if (!results.envVars || Object.values(results.envVars).some(v => !v)) {
    generateStripeTemplate();
  }
  
  generateReport(results);
  
  // Exit code
  const hasFailures = Object.values(results).some(result => !result);
  process.exit(hasFailures ? 1 : 0);
}

// Executar se chamado diretamente
main();
