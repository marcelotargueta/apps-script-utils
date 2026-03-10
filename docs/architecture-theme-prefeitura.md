# 🏛️ Theme — Prefeitura RJ (Rio-Águas)

## Overview

This theme defines the **institutional design tokens** for applications developed for **Rio-Águas**, an agency of the Prefeitura do Rio de Janeiro.
It represents the **official visual foundation** used across internal and public-facing applications, ensuring consistency, identity alignment, and long-term maintainability.

This theme is **not generic** and **not exploratory**. It is a **stable institutional baseline**, derived from real production usage.

## Scope

This theme is strictly limited to **design tokens**.

### Included

- Font families
- Brand colors and Semantic color roles
- Color scale foundations
- Shadows and elevation tokens

### Explicitly Excluded

The following **must not** be defined in this theme:

- UI components (`.card-*`, `.button-*`, `.input-*`)
- Layout utilities
- Animations or interaction states (`hover`, `focus`)
- Application-specific abstractions

## Design Philosophy

- **Institutional first**: reflects the visual identity of Rio-Águas and Prefeitura do Rio.
- **Semantic tokens**: colors and values are named by purpose, not appearance.
- **Predictable evolution**: new tokens may be added, existing ones should rarely change.
- **Low abstraction**: this file is meant to be read, audited, and trusted.

## Usage Rules

- This theme must be **imported after `input.base.css`**, never standalone.
- Applications may extend or override tokens **only in app-specific layers**, not by modifying this theme.

---

<details>
<summary>🇧🇷 <b>Ler em Português</b> <i>(Clique para expandir)</i></summary>

## 🏛️ Tema — Prefeitura RJ (Rio-Águas)

### Visão Geral

Este tema define os **design tokens institucionais** para aplicações desenvolvidas para a **Rio-Águas**, órgão da Prefeitura do Rio de Janeiro.
Ele representa a **fundação visual oficial** utilizada em aplicações internas e públicas, garantindo consistência, alinhamento de identidade e manutenibilidade a longo prazo.

Este tema **não é genérico** e **não é exploratório**. É uma **linha de base institucional estável**, derivada de uso real em produção.

### Escopo

Este tema é estritamente limitado a **design tokens**.

#### Incluído

- Famílias de fontes
- Cores da marca e papéis semânticos de cor
- Fundações de escala de cores
- Tokens de sombras e elevação

#### Explicitamente Excluído

O seguinte **não deve** ser definido neste tema:

- Componentes de UI (`.card-*`, `.button-*`, `.input-*`)
- Utilitários de layout
- Animações ou estados de interação (`hover`, `focus`)
- Abstrações específicas da aplicação

### Filosofia de Design

- **Institucional primeiro**: reflete a identidade visual da Rio-Águas e da Prefeitura do Rio.
- **Tokens semânticos**: cores e valores são nomeados por propósito, não por aparência.
- **Evolução previsível**: novos tokens podem ser adicionados, os existentes raramente devem mudar.
- **Baixa abstração**: este arquivo foi feito para ser lido, auditado e confiável.

### Regras de Uso

- Este tema deve ser **importado após o `input.base.css`**, nunca de forma isolada.
- Aplicações podem estender ou sobrescrever tokens **apenas em camadas específicas do app**, não modificando este tema.

</details>
