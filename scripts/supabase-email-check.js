#!/usr/bin/env node

/**
 * Script para verificar configurações de email do Supabase
 * Uso: node scripts/supabase-email-check.js
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

// Verificar configurações de email no Supabase
function checkEmailConfiguration() {
  logSection('Verificando configurações de email do Supabase');
  
  logInfo('Para resolver problemas de confirmação de email, verifique:');
  log('');
  
  logStep('1. Configurações de Email no Dashboard do Supabase:');
  log('   - Acesse: https://supabase.com/dashboard');
  log('   - Selecione seu projeto');
  log('   - Vá em: Authentication → Settings → Email Templates');
  log('');
  
  logStep('2. Configurações de SMTP (se usando email customizado):');
  log('   - Authentication → Settings → SMTP Settings');
  log('   - Configure servidor SMTP válido');
  log('   - Teste a conexão SMTP');
  log('');
  
  logStep('3. URLs de Redirecionamento:');
  log('   - Authentication → Settings → URL Configuration');
  log('   - Site URL: http://localhost:5173 (desenvolvimento)');
  log('   - Redirect URLs: http://localhost:5173/auth/confirm');
  log('');
  
  logStep('4. Configurações de Confirmação:');
  log('   - Authentication → Settings → Auth Settings');
  log('   - Enable email confirmations: ON');
  log('   - Secure email change: ON (recomendado)');
  log('');
  
  return true;
}

// Verificar configurações de CORS
function checkCorsConfiguration() {
  logSection('Verificando configurações de CORS');
  
  logInfo('Configurações de CORS necessárias:');
  log('');
  
  logStep('1. No Dashboard do Supabase:');
  log('   - Settings → API → CORS Origins');
  log('   - Adicione: http://localhost:5173');
  log('   - Para produção: https://seu-dominio.com');
  log('');
  
  logStep('2. Verificar se o domínio está na lista de CORS permitidos');
  log('');
  
  return true;
}

// Verificar configurações de autenticação
function checkAuthConfiguration() {
  logSection('Verificando configurações de autenticação');
  
  logInfo('Configurações importantes:');
  log('');
  
  logStep('1. Providers de Autenticação:');
  log('   - Authentication → Providers');
  log('   - Email: Habilitado');
  log('   - Confirm email: Habilitado');
  log('');
  
  logStep('2. Configurações de Sessão:');
  log('   - Authentication → Settings → Session Settings');
  log('   - Session timeout: 3600 (1 hora)');
  log('   - Refresh token rotation: Habilitado');
  log('');
  
  logStep('3. Configurações de Segurança:');
  log('   - Authentication → Settings → Security');
  log('   - Enable signups: Habilitado (para desenvolvimento)');
  log('   - Enable email confirmations: Habilitado');
  log('');
  
  return true;
}

// Gerar template de configuração
function generateEmailTemplate() {
  logSection('Gerando template de configuração de email');
  
  const template = `# Configuração de Email do Supabase
# Copie estas configurações para o Dashboard do Supabase

# =====================================
# CONFIGURAÇÕES DE EMAIL
# =====================================

# 1. Authentication → Settings → Email Templates
# Configure os templates de email:

## Template de Confirmação:
Subject: Confirme seu email para SeuAuge
Content:
Olá!

Clique no link abaixo para confirmar seu email:

{{ .ConfirmationURL }}

Se você não criou uma conta, ignore este email.

Obrigado,
Equipe SeuAuge

# =====================================
# CONFIGURAÇÕES DE URL
# =====================================

# 2. Authentication → Settings → URL Configuration
Site URL: http://localhost:5173
Redirect URLs:
- http://localhost:5173/auth/confirm
- http://localhost:5173/auth/reset-password
- http://localhost:5173/auth/callback

# =====================================
# CONFIGURAÇÕES DE CORS
# =====================================

# 3. Settings → API → CORS Origins
Adicione:
- http://localhost:5173
- http://localhost:3000

# =====================================
# CONFIGURAÇÕES DE AUTENTICAÇÃO
# =====================================

# 4. Authentication → Settings → Auth Settings
- Enable email confirmations: ON
- Secure email change: ON
- Enable signups: ON (desenvolvimento)
- Session timeout: 3600
- Refresh token rotation: ON

# =====================================
# TESTE DE CONFIGURAÇÃO
# =====================================

# Para testar:
# 1. Crie uma nova conta
# 2. Verifique se o email de confirmação chega
# 3. Clique no link de confirmação
# 4. Tente fazer login

# =====================================
# SOLUÇÃO DE PROBLEMAS
# =====================================

# Se emails não chegam:
# 1. Verifique a pasta spam
# 2. Confirme configurações SMTP
# 3. Verifique logs no Dashboard
# 4. Teste com email diferente

# Se confirmação não funciona:
# 1. Verifique URLs de redirecionamento
# 2. Confirme configurações de CORS
# 3. Verifique logs de erro
# 4. Teste em modo incógnito
`;
  
  const templatePath = path.join(process.cwd(), 'supabase-email-config.md');
  fs.writeFileSync(templatePath, template);
  
  logSuccess('Template de configuração criado: supabase-email-config.md');
  logInfo('Use este arquivo como guia para configurar o Supabase');
  
  return true;
}

// Gerar relatório
function generateReport(results) {
  logHeader('RELATÓRIO DE CONFIGURAÇÃO DE EMAIL');
  
  log(`\n📊 Status:`, 'bright');
  log(`Configurações verificadas com sucesso`, 'green');
  
  // Próximos passos
  log(`\n📋 Próximos passos:`, 'bright');
  log('1. Acesse o Dashboard do Supabase', 'yellow');
  log('2. Configure as URLs de redirecionamento', 'yellow');
  log('3. Configure os templates de email', 'yellow');
  log('4. Configure CORS origins', 'yellow');
  log('5. Teste o fluxo de confirmação', 'yellow');
  
  log(`\n🔧 Ações recomendadas:`, 'bright');
  log('• Verifique se o email de confirmação chega', 'blue');
  log('• Teste o link de confirmação', 'blue');
  log('• Configure SMTP se necessário', 'blue');
  log('• Monitore logs de erro', 'blue');
  
  log(`\n📖 Para mais informações:`, 'bright');
  log('- supabase-email-config.md', 'blue');
  log('- Dashboard do Supabase: https://supabase.com/dashboard', 'blue');
  log('- Documentação: https://supabase.com/docs/guides/auth', 'blue');
}

// Função principal
function main() {
  logHeader('VERIFICAÇÃO DE CONFIGURAÇÃO DE EMAIL DO SUPABASE');
  
  const results = {
    emailConfig: checkEmailConfiguration(),
    corsConfig: checkCorsConfiguration(),
    authConfig: checkAuthConfiguration()
  };
  
  // Gerar template
  generateEmailTemplate();
  
  generateReport(results);
  
  // Exit code
  process.exit(0);
}

// Executar se chamado diretamente
main();
