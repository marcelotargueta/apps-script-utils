# 🚀 SETUP: Ambiente de Desenvolvimento Moderno (Boilerplate)

Este guia descreve o passo a passo para configurar um novo projeto utilizando a **Modern Stack** (TypeScript + Tailwind v4 + Build System) definida nos nossos padrões.

> ⚠️ Este repositório (`apps-script-utils`) é **apenas de referência e infraestrutura**. Não precisa ser clonado; copie apenas os arquivos ou trechos do códigos que forem úteis para seu projeto.

---

## 1️⃣ Pré-requisitos

Certifique-se de ter instalado:

1. **Node.js** (v18+): `node -v`
2. **VS Code:** Com extensão **ESLint** e **Tailwind CSS IntelliSense**.

## 2️⃣ Inicialização e Dependências

Abra o terminal na pasta onde deseja criar o projeto:

```Bash
# 1. Crie a pasta do projeto
mkdir meu-novo-projeto
cd meu-novo-projeto

# 2. Inicie o Node.js (cria um package.json vazio inicial)
npm init -y

# 3. Instale as dependências da stack (DevDependencies)
npm install -D typescript @types/google-apps-script @google/clasp @tailwindcss/cli tailwindcss nodemon
```

## 3️⃣ Criação do Scaffolding (Estrutura de Pastas)

Execute os comandos abaixo para criar a árvore de diretórios padrão.

```Bash
# Pastas Raiz e Fonte
mkdir src
mkdir src/backend src/backend/api src/backend/controllers src/backend/dao src/backend/utils
mkdir src/frontend src/frontend/pages src/frontend/components src/frontend/scripts src/frontend/icons
mkdir src/styles src/types
```

## 4️⃣ Arquivos de Configuração (Boilerplate)

Em vez de escrever configurações do zero, **copie os arquivos oficiais** do repositório `apps-script-utils` para a raiz do seu novo projeto:

1. `package.json` e `tsconfig.json`: Copie de `templates/config/` (lembre-se de remover o prefixo `template`. ao colar no novo projeto).
2. **Sistema de Build:** Copie a pasta inteira `templates/build/` (que contém o `build-webapp.js` e o `build-auto.js`) para a raiz do projeto.

### 4.1 .gitignore Oficial (Obrigatório)

Crie o arquivo `.gitignore` na raiz com as regras estritas de segurança:

```Plaintext
# Dependências
node_modules/

# Artefatos de Build (Achatamento do GAS)
app/
src/styles/output.css

# Segurança CLASP & Credenciais (CRÍTICO: Nunca comite)
.clasp.json
.google_creds.json
creds.json

# Sistema e Logs
.DS_Store
Thumbs.db
*.log
.ai_context/

# Segredos Legados (Se ainda não migrou para o Utils_Env)
src/backend/config/Config_Ids.ts
```

_(Nota: O `package.json` e `tsconfig.json` DEVEM ser commitados para garantir a reprodutibilidade do ambiente em outras máquinas)._

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

## 7️⃣ Arquivos Core da Arquitetura (Aceleradores)

Para o projeto herdar os superpoderes da stack, copie os seguintes utilitários do `apps-script-utils`:

1. **Frontend:** `Component_HeadSetup.html` (Injeção do CSS) e `Script_RPC.html` (Envelopador async/await).
2. **Backend:** `Server_Main.ts` (Entry point de rotas) e `Utils_Env.ts` (O Cofre Tipado para IDs).

## 8️⃣ Fluxo de Trabalho (Workflow Automatizado)

A stack utiliza o conceito de **Dual Build**. Escolha o comando baseado na natureza do seu projeto:

### 🌐 Para Projetos Web (HTML/CSS + Backend)

**Desenvolvimento (Monitoramento e Upload Automático):**

```Bash
npm run dev:web
```

**Deploy Manual (Apenas Build e Push):**

```Bash
npm run push:web
```

### ⚙️ Para Projetos de Automação (Apenas Backend / Headless)

**Desenvolvimento (Monitoramento e Upload Automático):**

```Bash
npm run dev:auto
```

**Deploy Manual (Apenas Build e Push):**

```Bash
npm run push:auto
```
