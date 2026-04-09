---
title: "Lógica de Descrição"
group: "Lógica"
links: ["logica1", "logica3", "onto1", "websem2"]
video_url: ""
icon: "📐"
order: 2
id: "logica2"
---

# Lógica de Descrição (Description Logics)

As **Lógicas de Descrição (DL)** são uma família de linguagens de representação de conhecimento que formam a base teórica da Web Semântica.

## Componentes Básicos

### TBox (Terminological Box)
Define o **vocabulário** do domínio:
- `Human ⊑ Animal` (todo humano é um animal)
- `Parent ≡ Human ⊓ ∃hasChild.Human`

### ABox (Assertional Box)
Define **fatos** sobre indivíduos:
- `Human(João)`
- `hasChild(João, Maria)`

## Família de Linguagens DL

```
     ALC
    / | \
  S   F   ...
  |
 SH
  |
SHIQ → SHOIN → SROIQ
  ↓        ↓       ↓
OWL-Lite  OWL-DL  OWL 2
```

### Construtores Principais (ALC)
| Construtor | Sintaxe DL | Significado |
|-----------|-----------|-------------|
| Conjunção | C ⊓ D | interseção |
| Disjunção | C ⊔ D | união |
| Negação | ¬C | complemento |
| Restrição existencial | ∃R.C | pelo menos um |
| Restrição universal | ∀R.C | todos os |

## Inferências Principais

1. **Subsunção**: C é subclasse de D?
2. **Satisfazibilidade**: C pode ter instâncias?
3. **Classificação**: computar toda a hierarquia
4. **Realização**: quais classes um indivíduo pertence?

## Reasoners
- **HermiT**: para OWL 2 DL
- **Pellet**: completo e popular
- **ELK**: otimizado para EL++

> DLs são o **fundamento formal do OWL**, a linguagem padrão da Web Semântica.
