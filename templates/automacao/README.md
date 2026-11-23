# ⚙️ {{MACHINE_NAME}}

![Automação](https://img.shields.io/badge/Perfil-Automa%C3%A7%C3%A3o-2DA44E?style=for-the-badge)
![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google-apps-script&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

<!-- PROJECT: one sentence, in Portuguese, with what the app does and for whom -->

---

## 🧭 Perfil

**Automação**: roda por agendamento ou por execução manual, sem tela e sem endpoint. O backend em TypeScript roda no Google Apps Script, acionado pelos gatilhos do projeto.

---

## 🚀 Instalação

1. Tenha o Node.js 20 ou superior.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Entre com a conta Google do projeto e ative a API do Apps Script em [script.google.com/home/usersettings](https://script.google.com/home/usersettings):

   ```bash
   npx clasp login
   ```

4. Na raiz, o `.clasp.json` liga o projeto ao GAS e fica fora do Git. Se ele não existir, crie-o; preencha o `scriptId` com o ID do projeto GAS, que fica em **Configurações do projeto**, no editor do Apps Script:

   ```json
   { "scriptId": "<ID do script>", "rootDir": "./app" }
   ```

---

## ⌨️ Comandos

| Comando         | O que faz                                    |
| :-------------- | :------------------------------------------- |
| `npm run build` | Gera o `app/`, com todos os arquivos na raiz |
| `npm run push`  | Faz o build e envia o `app/` ao projeto GAS  |
| `npm run dev`   | Repete o `push` a cada mudança em `src/`     |

---

## 📁 Estrutura

```text
{{MACHINE_NAME}}/
├── build/build-auto.js     gera o app/
├── docs/                   artefatos do projeto
├── src/
│   ├── appsscript.json     manifesto
│   ├── backend/            api, controllers, dao, utils
│   └── types/              tipos globais
├── .clasp.json
├── package.json
└── tsconfig.json
```

O `app/` é gerado pelo build e fica fora do Git.

---

## 📚 Documentação

| Arquivo                                | Conteúdo                                |
| :------------------------------------- | :-------------------------------------- |
| [`docs/PROGRESS.md`](docs/PROGRESS.md) | O que o projeto é e onde ele está       |
| [`docs/INSIGHTS.md`](docs/INSIGHTS.md) | As lições de engenharia do projeto      |
| [`docs/CASE.md`](docs/CASE.md)         | A história do projeto, para quem decide |

[![Arquitetura](https://img.shields.io/badge/Arquitetura-apps--script--utils-black?style=for-the-badge&logo=github)](https://github.com/marcelotargueta/apps-script-utils)
