# 📧 Configuração de Email do Supabase - Guia Completo

## 🔧 **Configurações Necessárias no Dashboard do Supabase**

### 1. **Acessar o Dashboard**
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Navegue para **Authentication** → **Settings**

### 2. **Configurações de Email**

#### **Email Templates**
1. Vá para **Authentication** → **Settings** → **Email Templates**
2. Configure os seguintes templates:

**Confirmação de Email:**
```html
<h2>Confirme seu email</h2>
<p>Clique no link abaixo para confirmar seu email:</p>
<a href="{{ .ConfirmationURL }}">Confirmar Email</a>
<p>Se você não criou uma conta, ignore este email.</p>
```

**Recuperação de Senha:**
```html
<h2>Redefinir Senha</h2>
<p>Clique no link abaixo para redefinir sua senha:</p>
<a href="{{ .ConfirmationURL }}">Redefinir Senha</a>
<p>Este link expira em 1 hora.</p>
```

#### **Configurações SMTP (Opcional)**
1. Vá para **Authentication** → **Settings** → **SMTP Settings**
2. Configure um servidor SMTP personalizado se necessário
3. Teste a conexão SMTP

### 3. **URLs de Redirecionamento**

#### **Site URL**
1. Vá para **Authentication** → **Settings** → **URL Configuration**
2. Configure:
   - **Site URL**: `http://localhost:5173` (desenvolvimento)
   - **Redirect URLs**: 
     - `http://localhost:5173/auth/confirm`
     - `http://localhost:5173/auth/reset-password`
     - `http://localhost:5173/auth/callback`

### 4. **Configurações de Autenticação**

#### **Auth Settings**
1. Vá para **Authentication** → **Settings** → **Auth Settings**
2. Configure:
   - ✅ **Enable email confirmations**: ON
   - ✅ **Secure email change**: ON (recomendado)
   - ✅ **Enable signups**: ON (para desenvolvimento)
   - ✅ **Enable email confirmations**: ON

#### **Providers**
1. Vá para **Authentication** → **Providers**
2. Configure:
   - ✅ **Email**: Habilitado
   - ✅ **Confirm email**: Habilitado

### 5. **Configurações de Sessão**

#### **Session Settings**
1. Vá para **Authentication** → **Settings** → **Session Settings**
2. Configure:
   - **Session timeout**: 3600 (1 hora)
   - ✅ **Refresh token rotation**: Habilitado

### 6. **Configurações de Segurança**

#### **Security**
1. Vá para **Authentication** → **Settings** → **Security**
2. Configure:
   - ✅ **Enable signups**: Habilitado (para desenvolvimento)
   - ✅ **Enable email confirmations**: Habilitado
   - **Password minimum length**: 6
   - **Password strength**: Medium

## 🌐 **Configurações de CORS**

### 1. **CORS Origins**
1. Vá para **Settings** → **API** → **CORS Origins**
2. Adicione os domínios permitidos:
   - `http://localhost:5173` (desenvolvimento)
   - `https://seu-dominio.com` (produção)

### 2. **Verificar CORS**
```bash
# Verificar se o domínio está na lista de CORS permitidos
curl -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: X-Requested-With" \
  -X OPTIONS \
  https://seu-projeto.supabase.co/auth/v1/token
```

## 🧪 **Testando a Configuração**

### 1. **Teste de Registro**
1. Acesse sua aplicação
2. Tente registrar um novo usuário
3. Verifique se o email de confirmação é enviado
4. Clique no link de confirmação

### 2. **Teste de Login**
1. Tente fazer login com um usuário não confirmado
2. Verifique se a mensagem de erro é clara
3. Use o componente de confirmação de email

### 3. **Teste de Recuperação de Senha**
1. Tente recuperar a senha
2. Verifique se o email é enviado
3. Teste o link de redefinição

## 🚨 **Problemas Comuns e Soluções**

### **Email não é enviado**
- ✅ Verifique as configurações SMTP
- ✅ Teste a conexão SMTP
- ✅ Verifique se o email não está na pasta spam

### **Link de confirmação não funciona**
- ✅ Verifique as URLs de redirecionamento
- ✅ Confirme se o domínio está na lista de CORS
- ✅ Teste o link em uma guia anônima

### **Erro de CORS**
- ✅ Adicione o domínio na lista de CORS Origins
- ✅ Verifique se o protocolo (http/https) está correto
- ✅ Aguarde alguns minutos para propagação

### **Usuário não consegue fazer login**
- ✅ Verifique se o email foi confirmado
- ✅ Use o componente de confirmação de email
- ✅ Reenvie o email de confirmação

## 📋 **Checklist de Configuração**

- [ ] Email templates configurados
- [ ] SMTP configurado (se necessário)
- [ ] URLs de redirecionamento configuradas
- [ ] Confirmação de email habilitada
- [ ] CORS Origins configurados
- [ ] Teste de registro realizado
- [ ] Teste de login realizado
- [ ] Teste de recuperação de senha realizado

## 🔗 **Links Úteis**

- [Documentação do Supabase Auth](https://supabase.com/docs/guides/auth)
- [Configuração de Email](https://supabase.com/docs/guides/auth/auth-email)
- [Configuração de CORS](https://supabase.com/docs/guides/api/api-overview)
- [Templates de Email](https://supabase.com/docs/guides/auth/auth-email-templates)

## 📞 **Suporte**

Se você ainda tiver problemas após seguir este guia:

1. Verifique os logs no Dashboard do Supabase
2. Teste com um email diferente
3. Verifique se o projeto está ativo
4. Entre em contato com o suporte do Supabase

---

**✅ Configuração completa! Seu sistema de autenticação deve estar funcionando corretamente.**
