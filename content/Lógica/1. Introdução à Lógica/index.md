---
title: "Introdução à Lógica"
group: "Lógica"
links: ["logica2", "logica3"]
video_url: ""
icon: "🧮"
order: 1
id: "logica1"
---

# Introdução à Lógica

A **Lógica** é a disciplina que estuda os princípios do raciocínio válido e da inferência correta.

## Lógica Proposicional

### Conectivos Lógicos
| Símbolo | Nome | Significado |
|---------|------|-------------|
| ¬ | Negação | "não" |
| ∧ | Conjunção | "e" |
| ∨ | Disjunção | "ou" |
| → | Implicação | "se... então" |
| ↔ | Bicondicional | "se e somente se" |

### Tabelas-Verdade
Para qualquer fórmula proposicional, podemos determinar seu valor de verdade mecanicamente:

```
p | q | p → q
T | T |   T
T | F |   F
F | T |   T
F | F |   T
```

## Validade e Satisfazibilidade

- **Tautologia**: verdadeira em toda interpretação
- **Contradição**: falsa em toda interpretação
- **Contingência**: verdadeira em algumas, falsa em outras
- **Satisfazível**: verdadeira em pelo menos uma interpretação

## Sistemas de Prova

1. **Dedução Natural**: regras de introdução e eliminação
2. **Tableaux**: decomposição por contradição
3. **Resolução**: prova por refutação (base da Prolog!)

> A lógica é o **alicerce** da ciência da computação, da IA e da filosofia analítica.
