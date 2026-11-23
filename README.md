# 🧭 apps-script-utils

![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google-apps-script&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-D97757?style=for-the-badge&logo=claude&logoColor=white)

Regras, instruções e arquivos modelo para criar e manter projetos Google Apps Script em
TypeScript, construídos por Parceiros de IA.

---

## 🎯 O que é

A arquitetura separa a regra do fato. A **regra** vale para qualquer aplicação e fica nos
Standards. O **fato** é de uma aplicação só (entidades, papéis, permissões, códigos de erro) e fica
na pasta `docs/` de cada projeto. O Parceiro carrega os Standards sempre e o `docs/` do projeto
quando o recebe; por isso o mesmo Parceiro serve a qualquer aplicação
([CORE §1](standards/STANDARDS_CORE.md#1-propósito--fronteira)).

Os templates dão a todo projeto a mesma infraestrutura: build, configuração, envelope de erro e
os artefatos de `docs/`. O código de domínio é escrito no projeto, seguindo os Standards.

---

## 🧩 Perfis

Todo projeto pertence a um de três perfis, definidos por duas perguntas
([CORE §9](standards/STANDARDS_CORE.md#9-perfis-de-projeto)).

| Perfil        | Tem tela | Expõe endpoint | CONTRACT             |
| :------------ | :------- | :------------- | :------------------- |
| **WebApp**    | Sim      | Não            | `docs/CONTRACT.d.ts` |
| **Receptor**  | Não      | Sim            | `docs/CONTRACT.md`   |
| **Automação** | Não      | Não            | Não tem              |

Sistema que tem tela e também expõe endpoint são dois projetos: um WebApp e um Receptor.

---

## 🤝 Papéis

O **Parceiro** é o agente de IA que constrói o projeto: uma sessão com Standards carregados e uma
instrução de conduta. Os Standards dão a regra; a instrução, o comportamento.

| Papel                 | O que faz                                                                                              |
| :-------------------- | :----------------------------------------------------------------------------------------------------- |
| **Parceiro Backend**  | Constrói o backend, com o CORE e o BACKEND carregados                                                  |
| **Parceiro Frontend** | Constrói o frontend (design, marcação e comportamento), com o CORE, o FRONTEND e o TAILWIND carregados |
| **Chat de decisão**   | Decide o que vai para os Standards; não gera código                                                    |
| **Chat livre**        | Sem Standards: descobre regra de negócio, escreve o CASE e mantém aplicação de terceiros               |

---

## 📁 Estrutura

```text
apps-script-utils/
├── standards/                 regras da arquitetura
├── prompts/                   instruções de conduta
├── templates/                 arquivos modelo dos projetos
├── montador/                  script que cria o projeto
├── .claude/skills/montador/   skill /montador
└── DISCIPLINA_DE_ESCRITA.md   como se redige um Standard
```

---

## 📚 Documentos

| Documento                                                          | Para que serve                                                 |
| :----------------------------------------------------------------- | :------------------------------------------------------------- |
| [`STANDARDS_CORE.md`](standards/STANDARDS_CORE.md)                 | Regras que não dependem de stack nem de aplicação              |
| [`STANDARDS_BACKEND_GAS.md`](standards/STANDARDS_BACKEND_GAS.md)   | Mecânica do backend em Google Apps Script                      |
| [`STANDARDS_FRONTEND_GAS.md`](standards/STANDARDS_FRONTEND_GAS.md) | Mecânica do frontend no `HtmlService`                          |
| [`STANDARDS_TAILWIND.md`](standards/STANDARDS_TAILWIND.md)         | Estilo em Tailwind CSS v4                                      |
| [`INSTRUCAO_BACKEND.md`](prompts/INSTRUCAO_BACKEND.md)             | Conduta do Parceiro Backend                                    |
| [`INSTRUCAO_FRONTEND.md`](prompts/INSTRUCAO_FRONTEND.md)           | Conduta do Parceiro Frontend                                   |
| [`INSTRUCAO_CASE.md`](prompts/INSTRUCAO_CASE.md)                   | Conduta da sessão que escreve o CASE e regra do `docs/CASE.md` |
| [`DISCIPLINA_DE_ESCRITA.md`](DISCIPLINA_DE_ESCRITA.md)             | Como se redige um Standard                                     |

---

## 🧱 Templates

Arquivos modelo da arquitetura: a fonte única dos arquivos de infraestrutura de todo projeto. O
Montador cria o projeto copiando estes arquivos e troca só os marcadores; nunca escreve conteúdo.
O conteúdo de cada template segue os [Standards](standards/). Esta seção trata da organização de
`templates/` e do que o Montador faz com ela.

### Estrutura

```text
templates/
├── comum/                 todos os perfis
├── webapp/                só o WebApp
├── receptor/              só o Receptor
├── automacao/             só a Automação
├── receptor-automacao/    Receptor e Automação
└── webapp-receptor/       WebApp e Receptor
```

| Perfil    | Recebe                                                           |
| --------- | ---------------------------------------------------------------- |
| WebApp    | `comum/`, `webapp/`, `webapp-receptor/`                          |
| Receptor  | `comum/`, `receptor/`, `receptor-automacao/`, `webapp-receptor/` |
| Automação | `comum/`, `automacao/`, `receptor-automacao/`                    |

### Regras

1. **Espelho.** Cada pasta de `templates/` espelha a raiz do projeto: o caminho do arquivo dentro
   dela é o caminho que ele terá no projeto e o mesmo do `File` do cabeçalho. Exemplo:
   `comum/src/appsscript.json` vira `src/appsscript.json`.
2. **Cópia.** Para criar um projeto, o Montador copia `comum/` e toda pasta que tem o perfil como
   um dos segmentos do nome, separados por `-`. A tabela da Estrutura mostra o que cada perfil
   recebe.
3. **Arquivo de dois perfis.** Arquivo igual em exatamente dois perfis fica numa pasta com o nome
   dos dois, nunca duplicado nas pastas de perfil. Assim nenhum caminho se repete entre as pastas
   que um perfil recebe, e a ordem da cópia não importa.
4. **Artefatos.** Os templates de `docs/` ficam no `docs/` da pasta que os recebe. O README fica na
   raiz da pasta de cada perfil.
5. **Pasta vazia.** A pasta que nasce vazia no projeto leva `.gitkeep` no caminho espelhado.
6. **Nomes.** As pastas de primeiro nível de `templates/` e os itens da biblioteca têm nome em
   português, minúsculo, sem acento e em kebab-case.

### Marcadores

O Montador troca cada marcador por um valor do projeto: um nome da identidade
([CORE §4](standards/STANDARDS_CORE.md#4-identidade-do-projeto)) ou o perfil
([CORE §9](standards/STANDARDS_CORE.md#9-perfis-de-projeto)). Nenhum marcador sobra no projeto.

| Marcador            | Valor                     | Exemplo                        |
| ------------------- | ------------------------- | ------------------------------ |
| `{{MACHINE_NAME}}`  | `<área>-<nome>-<papel>`   | `org-gestao-contratos-webapp`  |
| `{{PROJECT_TITLE}}` | `<Área>_<Nome> - <Papel>` | `ORG_GestaoContratos - WebApp` |
| `{{PROFILE}}`       | O perfil                  | `WebApp`                       |

Para ver onde cada marcador aparece, busque `{{` em `templates/`.

O `PROJECT:` é outro tipo de marca: o Montador o copia como está, e ele indica o ponto que o
projeto preenche durante o trabalho
([CORE §15](standards/STANDARDS_CORE.md#15-templates-e-marcação-de-preenchimento)).

### Versões das dependências

O `package.json` fixa a versão exata de cada dependência, sem `^`: todo projeto nasce com o mesmo
conjunto testado. Para atualizar, a versão nova é testada num projeto e então trocada no template.
A cada projeto criado, o Montador lista as dependências com versão mais nova publicada; o projeto
nasce com as versões do template.

### Biblioteca

Cada item fica em `biblioteca/<item>/` e espelha a raiz do projeto, como as demais pastas. O item
entra no projeto quando o Parceiro o pede
([BACKEND §15.2](standards/STANDARDS_BACKEND_GAS.md#152-biblioteca)), não na criação.

---

## 🛠️ Montador

Cria a pasta de um projeto novo a partir de `templates/`, em duas peças: a skill `/montador`, do
Claude Code, propõe a identidade a partir de uma descrição; o script `montador/montador.js`
valida, copia e confere.

### Uso

Na raiz deste repositório, com o Claude Code aberto:

```text
/montador <descrição do projeto>
```

A skill propõe Área, Nome, Papel e perfil, com o Título e o nome de máquina calculados
([CORE §4](standards/STANDARDS_CORE.md#4-identidade-do-projeto),
[CORE §9](standards/STANDARDS_CORE.md#9-perfis-de-projeto)). Aprovada a proposta, ela roda o
script, que cria o projeto na pasta de destino.

O script também roda sozinho, com a identidade já decidida:

```text
node montador/montador.js <Área> <Nome> <Papel> <Perfil>
```

### Configuração

A pasta de destino fica em `montador/montador.config.json`, fora do Git: cada máquina tem o seu.
No Windows, a barra invertida do caminho vai dobrada: `\\`.

```json
{
  "destination": "<pasta onde os projetos nascem>"
}
```

### O que o script faz

1. Valida os termos: PascalCase, só letras, sem acento e sem espaço.
2. Calcula o nome de máquina e o Título.
3. Reúne `comum/` e as pastas do perfil e troca os marcadores.
4. Confere tudo antes de gravar e para, sem criar nada, se houver caminho repetido, marcador
   sobrando ou pasta de projeto já existente.
5. Grava o projeto.
6. Roda `npm install` e `npm run build`.
7. Inicia o Git no projeto e faz o primeiro commit, sempre como último passo.
8. Informa o Título, o número de arquivos, o de `PROJECT:` por resolver, o commit e as dependências
   com versão mais nova publicada.

Se a instalação, o build ou o Git falhar, o script apaga a pasta e para com o motivo: o projeto
nasce completo ou não nasce.

Não altera conteúdo além dos marcadores, não copia item da biblioteca e não cria arquivo de domínio.
