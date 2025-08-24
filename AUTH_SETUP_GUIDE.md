# Guia de Configuração e Correção de Autenticação

## 🚨 Problemas Comuns de Autenticação

### 1. **Variáveis de Ambiente Não Configuradas**

**Sintomas:**
- Erro: "Missing Supabase environment variables"
- Aplicação não carrega
- Login/registro não funciona

**Solução:**
1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione as seguintes variáveis:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# Admin Configuration (desenvolvimento)
VITE_ADMIN_EMAIL=admin@seuauge.com

# Feature Flags
VITE_DEV_MODE=true
```

### 2. **Projeto Supabase Não Configurado**

**Sintomas:**
- Erro de conexão com Supabase
- "Project not found" ou "Invalid API key"

**Solução:**
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Crie um novo projeto ou selecione um existente
3. Vá em **Settings > API**
4. Copie a **URL** e **anon key**
5. Configure no arquivo `.env.local`

### 3. **Políticas de Segurança do Banco**

**Sintomas:**
- Erro de acesso negado ao banco
- "Row Level Security" errors

**Solução:**
1. Execute o arquivo `supabase-security-policies.sql` no SQL Editor do Supabase
2. Verifique se as tabelas foram criadas corretamente
3. Confirme se RLS está habilitado

### 4. **Problemas de CORS**

**Sintomas:**
- Erro de CORS no console do navegador
- Requisições bloqueadas

**Solução:**
1. No Supabase Dashboard, vá em **Settings > API**
2. Em **CORS Origins**, adicione:
   - `http://localhost:5173` (desenvolvimento)
   - `https://seu-dominio.com` (produção)

### 5. **Sessão Expirada**

**Sintomas:**
- Usuário deslogado inesperadamente
- Erro de token inválido

**Solução:**
1. Use o componente `AuthFixer` para renovar a sessão
2. Ou limpe os dados de autenticação e faça login novamente

## 🔧 Ferramentas de Correção

### Componente de Diagnóstico

Use o componente `AuthDiagnostic` para verificar automaticamente:

```tsx
import AuthDiagnostic from './components/Auth/AuthDiagnostic';

// No seu componente
<AuthDiagnostic />
```

### Corretor Automático

Use o componente `AuthFixer` para corrigir problemas automaticamente:

```tsx
import AuthFixer from './components/Auth/AuthFixer';

// No seu componente
<AuthFixer />
```

## 📋 Checklist de Configuração

### ✅ Configuração Básica
- [ ] Arquivo `.env.local` criado
- [ ] `VITE_SUPABASE_URL` configurado
- [ ] `VITE_SUPABASE_ANON_KEY` configurado
- [ ] Projeto Supabase ativo

### ✅ Banco de Dados
- [ ] Tabelas criadas (`user_profiles`, etc.)
- [ ] Políticas de segurança aplicadas
- [ ] RLS habilitado
- [ ] Funções de banco configuradas

### ✅ Autenticação
- [ ] Auth providers configurados
- [ ] Email templates configurados
- [ ] CORS configurado
- [ ] Redirecionamentos configurados

### ✅ Segurança
- [ ] Variáveis de ambiente seguras
- [ ] Políticas de senha configuradas
- [ ] Rate limiting ativo
- [ ] Logs de segurança habilitados

## 🛠️ Comandos Úteis

### Verificar Configuração
```bash
# Verificar se as variáveis estão definidas
npm run dev

# Verificar dependências
npm audit

# Verificar tipos TypeScript
npm run type-check
```

### Limpar Cache
```bash
# Limpar cache do npm
npm cache clean --force

# Remover node_modules
rm -rf node_modules package-lock.json
npm install
```

### Resetar Dados de Autenticação
```javascript
// No console do navegador
localStorage.clear();
sessionStorage.clear();
window.location.reload();
```

## 🔍 Debugging

### Verificar Variáveis de Ambiente
```javascript
// No console do navegador
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
```

### Verificar Conexão Supabase
```javascript
// No console do navegador
import { supabase } from './src/lib/supabaseClient';
const { data, error } = await supabase.auth.getSession();
console.log('Session:', data, 'Error:', error);
```

### Verificar Banco de Dados
```javascript
// No console do navegador
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .limit(1);
console.log('DB Test:', data, 'Error:', error);
```

## 🚀 Configuração para Produção

### 1. Variáveis de Ambiente
```bash
# Produção
VITE_DEV_MODE=false
VITE_APP_URL=https://seu-dominio.com
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

### 2. CORS Configuration
No Supabase Dashboard:
- Adicione seu domínio de produção
- Remova localhost se não necessário

### 3. Security Headers
Configure no seu servidor:
```javascript
// Headers de segurança
{
  'Content-Security-Policy': "default-src 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}
```

## 📞 Suporte

### Problemas Comuns e Soluções

**Q: A aplicação não carrega**
A: Verifique se as variáveis de ambiente estão configuradas corretamente

**Q: Login não funciona**
A: Verifique se o projeto Supabase está ativo e as políticas de segurança estão aplicadas

**Q: Erro de CORS**
A: Configure as origens permitidas no painel do Supabase

**Q: Sessão expira rapidamente**
A: Verifique as configurações de sessão no Supabase

**Q: Usuário não consegue se registrar**
A: Verifique se o registro está habilitado no Supabase Auth settings

### Logs Úteis

Para debug, adicione logs temporários:

```javascript
// No AuthContext.tsx
console.log('Login attempt:', email);
console.log('Auth response:', data, error);
```

### Contato

Se os problemas persistirem:
1. Verifique os logs do console
2. Use os componentes de diagnóstico
3. Consulte a documentação do Supabase
4. Entre em contato com o suporte

---

**Última atualização:** $(date)
**Versão:** 1.0.0
