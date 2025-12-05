# MecConnect

Projeto React Native com Expo Router e NativeWind para iOS, Android e Web.

## Instalação

```bash
npm install
```

## Desenvolvimento

### Iniciar servidor de desenvolvimento

```bash
npx expo start
```

### Opções de desenvolvimento:

- Pressione `a` - Android emulator
- Pressione `i` - iOS simulator
- Pressione `w` - Web browser
- Pressione `r` - Reload app
- Pressione `c` - Clear cache e reload

## Builds com EAS Build

### Pré-requisitos

```bash
# Login no EAS (já está logado como carloslimamecwide)
eas login

# Inicializar projeto EAS (cria projectId)
eas init
```

### Android Builds

#### Development Build (APK para testes internos)

```bash
eas build --platform android --profile development
```

#### Preview Build (APK para testes)

```bash
eas build --platform android --profile preview
```

#### Production Build (AAB para Google Play Store)

```bash
eas build --platform android --profile production
```

### iOS Builds

#### Development Build (Simulador)

```bash
eas build --platform ios --profile development
```

#### Preview Build (Testes internos)

```bash
eas build --platform ios --profile preview
```

#### Production Build (TestFlight/App Store)

```bash
eas build --platform ios --profile production
```

### Web Build

#### Export para hospedagem estática

```bash
npx expo export
```

Os arquivos serão gerados em `dist/` e podem ser hospedados em qualquer servidor web estático (Vercel, Netlify, IIS, etc.).

### Builds Simultâneos (iOS + Android)

```bash
eas build --platform all --profile production
```

## Atualizações OTA (EAS Update)

### Publicar update OTA

```bash
npx eas update --branch main --message "ajuste x"
```

#### Publicar em branch/ambiente de testes (ex.: staging)

```bash
npx eas update --branch staging --message "teste antes da produção"
```

#### Publicar em produção (branch main)

```bash
npx eas update --branch main --message "release produção"
```

##### Produção separado por plataforma

```bash
# Apenas iOS
npx eas update --branch main --platform ios --message "release produção ios"

# Apenas Android
npx eas update --branch main --platform android --message "release produção android"
```

### Ver histórico de updates

```bash
npx eas update:list --branch main
```

### Observações

- Certifique-se de que `updates.enabled` está `true` e `runtimeVersion` permanece estável enquanto não houver mudanças nativas.
- Se alterar dependências nativas, gere novo build de loja (`eas build --profile production --platform all`) antes do próximo OTA.

## Submissão para Lojas

### Submeter para App Store (iOS)

```bash
eas submit --platform ios
```

### Submeter para Google Play Store (Android)

```bash
eas submit --platform android
```

## Atualizar Dependências

```bash
npx expo install --fix
```

## Limpar Cache

```bash
npx expo start --clear
```

## Estrutura do Projeto

```
MecConnect/
├── app/                    # Rotas e telas (Expo Router)
│   ├── _layout.tsx         # Layout principal com AuthProvider
│   ├── index.tsx           # Página inicial (redireciona para login)
│   ├── login.tsx           # Tela de login
│   ├── dashboard.tsx       # Dashboard principal
│   ├── forms.tsx           # Gestão de formulários
│   ├── notifications.tsx   # Central de notificações
│   ├── users.tsx           # Gestão de utilizadores
│   └── settings.tsx        # Definições
├── src/
│   ├── components/
│   │   └── layout/         # Componentes de layout
│   │       ├── AppLayout.tsx      # Layout principal com sidebar
│   │       ├── Sidebar.tsx        # Sidebar/Drawer responsiva
│   │       ├── Header.tsx         # Header com menu mobile
│   │       └── PageWrapper.tsx    # Wrapper de páginas
│   ├── contexts/
│   │   └── AuthContext.tsx        # Contexto de autenticação
│   ├── hooks/
│   │   └── useIsDesktop.ts        # Hook para detectar desktop/mobile
│   ├── services/
│   │   └── authService.ts         # Serviço de autenticação
│   └── types/
│       └── auth.ts                # Tipos de autenticação
├── assets/             # Imagens, ícones e recursos estáticos
├── global.css          # Estilos globais do NativeWind
├── tailwind.config.js  # Configuração do Tailwind/NativeWind
├── eas.json            # Configuração de builds EAS
└── app.json            # Configuração do Expo
```

## Arquitetura e Layout

### Layout Responsivo

- **Desktop (≥768px)**: Sidebar fixa + Header + Conteúdo
- **Mobile (<768px)**: Drawer + Header com menu hambúrguer + Conteúdo

### Autenticação

- AuthContext gerencia estado de login
- authService faz chamadas ao backend e armazena token/user no AsyncStorage
- Fluxo: Login → Dashboard (protegido)

### Navegação

- Expo Router para file-based routing
- Sidebar com navegação entre páginas
- Rotas: `/login`, `/dashboard`, `/forms`, `/notifications`, `/users`, `/settings`

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Deploy Web no IIS

Para publicar a versão web do MecConnect em um servidor IIS (Windows):

1. Gere os arquivos estáticos de produção:

   ```bash
   npx expo export
   ```

   Os arquivos serão gerados na pasta `dist/`.

2. No IIS, crie um site ou aplicação apontando para o diretório web.
   - Exemplo: `C:\inetpub\wwwroot\MecConnectWeb`
   - **IMPORTANTE**: Copie apenas o **conteúdo** da pasta `dist/` (não a pasta em si) para este diretório.
   - O diretório deve conter diretamente: `index.html`, `_expo/`, `assets/`, etc.

3. Configure o IIS para servir arquivos estáticos:
   - Certifique-se de que o arquivo `index.html` está como documento padrão.
   - Habilite o MIME type para `.js`, `.css`, `.json`, `.map` se necessário.
   - Para rotas do SPA, adicione uma regra de reescrita para redirecionar todas as URLs para `index.html` (usando o módulo URL Rewrite).

4. Reinicie o IIS ou o site para aplicar as mudanças.

5. Acesse pelo navegador: `http://<seu-servidor>/`.

### Atualizar a Aplicação Web

Depois de fazer alterações no código:

1. Gere novamente os arquivos estáticos:

   ```bash
   npx expo export
   ```

2. Copie o conteúdo atualizado de `dist/` para o diretório do IIS, substituindo os arquivos antigos.

3. Reinicie o site no IIS (opcional, mas recomendado para garantir cache limpo).

### Dicas

- Se usar rotas do Expo Router, a regra de reescrita é essencial para navegação funcionar corretamente.
- Para ambientes corporativos, valide permissões de acesso e firewall.
- Sempre copie o **conteúdo** de `dist/`, não a pasta em si.
