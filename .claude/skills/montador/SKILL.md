---
name: montador
description: Cria a pasta de um projeto Google Apps Script novo a partir dos templates da arquitetura, com a identidade do CORE §4 e o perfil do CORE §9.
argument-hint: <descrição do projeto>
disable-model-invocation: true
---

# Montador

Cria um projeto novo em duas etapas: a skill propõe a identidade a partir da descrição do
desenvolvedor e, com a aprovação dele, roda o script que copia os templates. A skill não cria nem
altera arquivo; quem grava é o script.

Descrição do desenvolvedor: $ARGUMENTS

## 1. Regras

Leia em `${CLAUDE_PROJECT_DIR}/standards/STANDARDS_CORE.md` a Seção 4 (identidade do projeto) e a
Seção 9 (perfis de projeto). A proposta segue as duas como estão.

## 2. Proposta

1. Sem descrição, peça uma e pare.
2. Leia `${CLAUDE_PROJECT_DIR}/montador/montador.config.json` e liste as pastas do `destination`.
   Se a descrição for de um sistema que já tem pasta ali, proponha a mesma Área e o mesmo Nome.
3. Se a descrição não disser quem encomenda o trabalho, ou não responder às duas perguntas do
   perfil, pergunte antes de propor, uma pergunta por vez.
4. Proponha uma identidade só, nesta tabela:

   | Termo           | Valor |
   | --------------- | ----- |
   | Área            |       |
   | Nome            |       |
   | Papel           |       |
   | Perfil          |       |
   | Título          |       |
   | Nome de máquina |       |

5. Espere a aprovação. A correção do desenvolvedor substitui a proposta; nenhum termo muda sem
   ele.

## 3. Execução

Aprovada a proposta, rode:

```
node "${CLAUDE_PROJECT_DIR}/montador/montador.js" <Área> <Nome> <Papel> <Perfil>
```

- Os termos vão exatamente como aprovados. O perfil vai como `WebApp`, `Receptor` ou `Automacao`.
- O comando instala as dependências e leva até alguns minutos: rode-o com o tempo limite de 10
  minutos.
- **Sucesso:** informe em português a pasta criada, o nome de máquina, o Título, o número de
  arquivos, o número de `PROJECT:` por resolver, o primeiro commit e as dependências com versão
  mais nova publicada, quando o script as listar. Se o nome de máquina ou o Título que o script
  imprime diferir da proposta, aponte a diferença.
- **Erro:** o script imprime um código e o motivo. Explique em português o que falta corrigir e
  volte à proposta. Nunca contorne o erro: não crie nem copie arquivo à mão, não altere template
  nem configuração e não rode de novo com outro termo sem a aprovação do desenvolvedor.

> porquê: o script é o único caminho que garante que todo projeto nasce igual ao template.

A skill termina com a pasta criada. Resolver os `PROJECT:`, ligar o projeto ao GAS e escrever
código de domínio é trabalho do projeto, fora desta skill.
