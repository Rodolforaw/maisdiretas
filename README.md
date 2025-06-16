# SOMAR +Diretas

Sistema de Controle de Obras Públicas para a Prefeitura de Maricá - RJ

## 🏗️ Sobre o Projeto

O **SOMAR +Diretas** é um sistema completo de gestão de obras públicas desenvolvido para otimizar o controle e acompanhamento de construções, reformas e serviços de infraestrutura urbana na cidade de Maricá.

### ✨ Funcionalidades Principais

- 📋 **Gestão de Ordens de Serviço**: Criação, acompanhamento e controle completo
- 🏗️ **Controle de Obras**: Monitoramento em tempo real do progresso
- 🗺️ **Mapa Interativo**: Visualização geográfica de todas as obras
- 👥 **Gestão de Equipes**: Controle de funcionários e responsabilidades
- 📦 **Controle de Materiais**: Gestão de estoque e fornecedores
- 🚛 **Gestão de Equipamentos**: Controle de máquinas e veículos
- 📊 **Relatórios Avançados**: Dashboards e análises detalhadas
- 💬 **Sistema de Mensagens**: Comunicação interna integrada
- 🔐 **Controle de Acesso**: Sistema de permissões por cargo

### 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI/UX**: Tailwind CSS, Radix UI, Lucide Icons
- **Mapas**: Leaflet
- **Storage**: IndexedDB (Local), localStorage
- **Deploy**: Vercel

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

\`\`\`bash
# Clone o repositório
git clone https://github.com/Rodolforaw/-Diretas.git

# Entre no diretório
cd -Diretas

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
\`\`\`

### Scripts Disponíveis

\`\`\`bash
npm run dev        # Executa em modo desenvolvimento
npm run build      # Gera build de produção
npm run start      # Executa build de produção
npm run lint       # Executa linting
npm run type-check # Verifica tipos TypeScript
\`\`\`

## 🏗️ Estrutura do Projeto

\`\`\`
├── app/                    # App Router do Next.js
│   ├── admin/             # Painel administrativo
│   ├── dashboard/         # Dashboard principal
│   ├── login/             # Página de login
│   ├── obras/             # Gestão de obras
│   ├── ordens/            # Ordens de serviço
│   ├── mapa/              # Mapa interativo
│   └── ...
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de UI base
│   ├── app-sidebar.tsx   # Sidebar da aplicação
│   ├── map.tsx           # Componente do mapa
│   └── ...
├── lib/                  # Utilitários e configurações
└── public/               # Arquivos estáticos
\`\`\`

## 👥 Sistema de Usuários

### Tipos de Usuário

- **Admin/Master**: Acesso completo ao sistema
- **Gerente**: Gestão de obras e relatórios
- **Supervisor**: Supervisão de equipes
- **Encarregado**: Coordenação de obras específicas
- **Funcionário**: Acesso básico para consultas

### Credenciais de Teste

\`\`\`
Usuário: admin
Senha: admin123

Usuário: gerente01
Senha: gerente123
\`\`\`

## 🗺️ Funcionalidades do Mapa

- Visualização de todas as obras em tempo real
- Marcadores customizados por status da obra
- Filtros por distrito e status
- Popup com informações detalhadas
- Geolocalização para novas obras

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

## 🔒 Segurança

- Autenticação baseada em sessões
- Controle de acesso por perfil
- Proteção contra XSS e CSRF
- Headers de segurança configurados

## 📊 Relatórios Disponíveis

- Resumo executivo de obras
- Relatórios por distrito
- Análise de produtividade
- Controle de materiais e equipamentos
- Performance de equipes

## 🎨 Design System

O projeto utiliza um design system baseado em:
- Cores da identidade SOMAR
- Tipografia Inter
- Espaçamentos consistentes
- Componentes reutilizáveis

## 🌐 Deploy

### Vercel (Recomendado)

1. Conecte o repositório GitHub ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- AWS Amplify
- Azure Static Web Apps

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🏢 Sobre a SOMAR

**SOMAR - Soluções em Obras e Meio Ambiente** é uma empresa especializada em:
- Obras de infraestrutura urbana
- Gestão ambiental
- Consultoria em projetos públicos
- Tecnologia para o setor público

📍 **Localização**: Maricá - RJ  
🌐 **Website**: [Em breve]  
📧 **Contato**: contato@somar.com.br

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:
- 📧 Email: suporte@somar.com.br
- 📱 WhatsApp: (21) 99999-9999
- 🕒 Horário: Segunda a Sexta, 8h às 18h

---

<div align="center">
  <p>Desenvolvido com ❤️ pela equipe SOMAR</p>
  <p>© 2024 SOMAR - Todos os direitos reservados</p>
</div>
