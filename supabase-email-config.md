# Configuração de Email do Supabase
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
