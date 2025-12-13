# 🚀 SETUP: Ambiente de Desenvolvimento Moderno (Boilerplate)

Este guia descreve o passo a passo para configurar um novo projeto utilizando a **Modern Stack** (TypeScript + Tailwind v4 + Build System) definida nos nossos padrões.

> ⚠️ Este repositório (`apps-script-utils`) é **apenas de referência**. Não precisa ser clonado; copie apenas os arquivos ou trechos do códigos que forem úteis para seu projeto.

---

## 1️⃣ Pré-requisitos

Certifique-se de ter instalado:

1. **Node.js** (v18+): `node -v`
2. **VS Code:** Com extensão **ESLint** e **Tailwind CSS IntelliSense**.

## 2️⃣ Inicialização do Projeto

Abra o terminal na pasta onde deseja criar o projeto:

```Bash
# 1. Crie a pasta do projeto
mkdir meu-novo-projeto
cd meu-novo-projeto

# 2. Inicie o Node.js
npm init -y

# 3. Instale as dependências (DevDependencies)
npm install -D typescript @types/google-apps-script @google/clasp @tailwindcss/cli tailwindcss nodemon
```

## 3️⃣ Criação do Scaffolding (Estrutura de Pastas)

Execute os comandos abaixo para criar a árvore de diretórios padrão.

**Nota:** Adicionada a pasta `icons` para SVGs componentizados.

```Bash
# Pastas Raiz e Fonte
mkdir src
mkdir src/backend
mkdir src/backend/api src/backend/controllers src/backend/dao src/backend/models src/backend/utils
mkdir src/frontend
mkdir src/frontend/pages src/frontend/components src/frontend/icons
mkdir src/styles
```

## 4️⃣ Arquivos de Configuração (Boilerplate)

Crie os arquivos essenciais na raiz do projeto.

### 4.1 `tsconfig.json`

```JSON
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext"],
    "module": "None",
    "moduleResolution": "Node",
    "strict": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"]
}
```

### 4.2 `package.json` (Scripts)

Substitua a seção `"scripts"` do seu `package.json` por:

```JSON
"scripts": {
  "css": "npx @tailwindcss/cli -i ./src/styles/input.css -o ./src/styles/output.css",
  "css:watch": "npx @tailwindcss/cli -i ./src/styles/input.css -o ./src/styles/output.css --watch",
  "build": "npm run css && node build.js",
  "push": "npm run build && npx clasp push --force",
  "dev": "npx nodemon --watch src -e ts,html,json,css --exec \"npm run push\""
}
```

### 4.3 `build.js`

Copie o script de build oficial (localizado em `apps-script-utils/build.js`) para a raiz deste novo projeto.

### 4.4 `.gitignore`

```Text
node_modules/
app/
src/styles/output.css
.clasp.json
```

## 5️⃣ Configuração do Tailwind CSS

Crie o arquivo de entrada com o tema: `src/styles/input.css`

```CSS
@import "tailwindcss";

@theme {
  /* Defina suas variáveis de Design System aqui */
  --font-sans: "Montserrat", sans-serif;
  --color-primary: #13335a;
}
```

## 6️⃣ Conexão com Google Apps Script (CLASP)

### 6.1 Login

```Bash
npx clasp login
```

### 6.2 Criar ou Clonar

#### Opção A: Novo Projeto

```Bash
# Cria um projeto 'webapp' na pasta raiz (será ajustado depois)
npx clasp create --type webapp --title "Nome do Projeto - ENV" --rootDir .
```

#### Opção B: Projeto Existente

```Bash
npx clasp clone <SCRIPT_ID> --rootDir .
```

### 6.3 Ajuste Crítico (`.clasp.json`)

Abra o arquivo `.clasp.json` criado e altere o `rootDir` para apontar para a pasta de distribuição:

```JSON
{
  "scriptId": "SEU_SCRIPT_ID_AQUI",
  "rootDir": "./app"
}
```

## 7️⃣ Arquivos Core (Obrigatórios)

Para o projeto rodar, você precisa copiar 2 arquivos base do `apps-script-utils`:

1. `src/backend/api/Server_Main.ts`: Contém `doGet` e `include`.
2. `src/frontend/components/Component_HeadSetup.html`: Contém a injeção do Tailwind.

## 8️⃣ Fluxo de Trabalho (Workflow)

Agora tudo está pronto.

1. **Desenvolver:**

   Rodar o comando abaixo. Ele vai monitorar seus arquivos TS/HTML/CSS, compilar tudo, gerar o CSS e fazer upload automático a cada salvamento.

```Bash
npm run dev
```

2. **Deploy Manual:**

```Bash
npm run push
```
