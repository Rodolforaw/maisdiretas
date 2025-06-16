# 🚀 Guia de Deploy - SOMAR +Diretas

Este guia fornece instruções detalhadas para fazer o deploy do sistema SOMAR +Diretas.

## 📋 Pré-requisitos

- Node.js 18+
- Git
- Conta no GitHub
- Conta no Vercel (recomendado)

## 🔄 Preparação do Repositório

### 1. Clone e Setup Inicial

\`\`\`bash
# Se ainda não clonou
git clone https://github.com/Rodolforaw/-Diretas.git
cd -Diretas

# Instale as dependências
npm install

# Teste localmente
npm run dev
\`\`\`

### 2. Verificação do Build

\`\`\`bash
# Teste o build de produção
npm run build
npm run start
\`\`\`

## 🌐 Deploy no Vercel (Recomendado)

### Método 1: Via Interface Web

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Selecione o repositório `Rodolforaw/-Diretas`
5. Configure as seguintes opções:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (raiz)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Método 2: Via CLI

\`\`\`bash
# Instale a CLI do Vercel
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel

# Para production
vercel --prod
\`\`\`

### 3. Configurações de Ambiente

No painel do Vercel, configure as seguintes variáveis:

\`\`\`env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
\`\`\`

## 🌍 Deploy em Outras Plataformas

### Netlify

1. Conecte o repositório no [netlify.com](https://netlify.com)
2. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18

### Railway

\`\`\`bash
# Instale a CLI do Railway
npm install -g @railway/cli

# Login e deploy
railway login
railway link
railway up
\`\`\`

### AWS Amplify

1. Acesse o console da AWS Amplify
2. Conecte o repositório GitHub
3. Configure:
   - **Build settings**: Auto-detect (Next.js)
   - **Environment**: Node.js 18

## 🔧 Configurações de Build

### next.config.js

\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Para containers
  trailingSlash: false,
  images: {
    unoptimized: true // Para static export se necessário
  }
}

module.exports = nextConfig
\`\`\`

### Para Static Export (se necessário)

\`\`\`bash
# Adicione ao package.json
"scripts": {
  "export": "next build && next export"
}

# Execute
npm run export
\`\`\`

## 🐳 Deploy com Docker

### Dockerfile

\`\`\`dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
\`\`\`

### docker-compose.yml

\`\`\`yaml
version: '3.8'
services:
  somar-diretas:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
\`\`\`

## 🔍 Verificação do Deploy

### Checklist Pós-Deploy

- [ ] Aplicação carrega corretamente
- [ ] Login funciona
- [ ] Mapa carrega sem erros
- [ ] Responsividade mobile
- [ ] Performance adequada
- [ ] SEO meta tags
- [ ] PWA funcional
- [ ] HTTPS ativo

### URLs para Testar

- `/` - Redirecionamento
- `/login` - Página de login
- `/dashboard` - Dashboard principal
- `/obras` - Lista de obras
- `/mapa` - Mapa interativo
- `/admin` - Painel admin (com permissão)

## 🔒 Configurações de Segurança

### Headers de Segurança

Já configurados no `next.config.js`:

\`\`\`javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ];
}
\`\`\`

### SSL/HTTPS

- Vercel: Automático
- Netlify: Automático
- Outros: Configure certificado SSL

## 📊 Monitoramento

### Analytics

\`\`\`javascript
// Google Analytics (opcional)
// Adicione o código no layout.tsx
\`\`\`

### Performance Monitoring

\`\`\`javascript
// Vercel Analytics
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\`

## 🔄 CI/CD Pipeline

### GitHub Actions

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
\`\`\`

## 🚨 Troubleshooting

### Problemas Comuns

1. **Build falha**:
   \`\`\`bash
   npm run lint
   npm run type-check
   \`\`\`

2. **Módulos não encontrados**:
   \`\`\`bash
   rm -rf node_modules package-lock.json
   npm install
   \`\`\`

3. **Problemas de TypeScript**:
   \`\`\`bash
   npx tsc --noEmit
   \`\`\`

4. **Leaflet SSR issues**:
   - Usar `dynamic` import
   - `ssr: false`

### Logs de Debug

\`\`\`bash
# Vercel
vercel logs [deployment-url]

# Local debug
npm run build 2>&1 | tee build.log
\`\`\`

## 📞 Suporte

Para problemas de deploy:
- 📧 Email: suporte@somar.com.br
- 📱 WhatsApp: (21) 99999-9999
- 📚 Documentação: README.md

---

🎉 **Parabéns!** Seu sistema SOMAR +Diretas está no ar!
