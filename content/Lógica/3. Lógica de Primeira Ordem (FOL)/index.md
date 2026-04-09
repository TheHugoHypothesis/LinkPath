---
title: "Lógica de Primeira Ordem"
group: "Lógica"
links: ["logica1", "logica2", "ia1"]
video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
icon: "∀"
order: 3
id: "logica3"
---

# Lógica de Primeira Ordem (FOL)

A **Lógica de Primeira Ordem** (First-Order Logic) estende a lógica proposicional com **quantificadores** e **predicados**, permitindo expressar relações entre objetos.

## Sintaxe

### Vocabulário
- **Constantes**: `a, b, c, João, Maria`
- **Variáveis**: `x, y, z`
- **Predicados**: `Humano(x), Pai(x,y)`
- **Funções**: `mãe(x), idade(x)`
- **Quantificadores**: `∀` (para todo), `∃` (existe)

### Exemplos de Fórmulas

```
∀x (Humano(x) → Mortal(x))
"Todo humano é mortal"

∃x (Estudante(x) ∧ Inteligente(x))  
"Existe algum estudante inteligente"

∀x∀y (Pai(x,y) → Ancestral(x,y))
"Todo pai é ancestral"
```

## Semântica

### Estrutura / Modelo
Uma estrutura **M** = ⟨D, I⟩ onde:
- **D**: domínio (conjunto não-vazio de entidades)
- **I**: função de interpretação

### Satisfação
- M ⊨ ∀x φ(x)  ⟺  para todo d ∈ D, M ⊨ φ(d)
- M ⊨ ∃x φ(x)  ⟺  para algum d ∈ D, M ⊨ φ(d)

## Teoremas Fundamentais

1. **Completude** (Gödel 1930): toda fórmula válida é demonstrável
2. **Compacidade**: se todo subconjunto finito é satisfazível, o conjunto todo é
3. **Indecidibilidade** (Church-Turing): o problema da validade em FOL é indecidível

## Aplicações
- **Prolog**: programação lógica baseada em FOL
- **SQL**: fundamentado em cálculo relacional (FOL)
- **Verificação formal**: provar propriedades de software

> FOL é **o** formalismo central da lógica matemática e da ciência da computação teórica.
