---
title: "Introdução a Ontologias — BFO"
group: "Ontologias"
links: ["onto2", "logica2", "websem2"]
video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
icon: "🏛️"
order: 1
id: "onto1"
---

# Basic Formal Ontology (BFO)

A **Basic Formal Ontology (BFO)** é uma ontologia de topo (*upper ontology*) que fornece um framework para construir ontologias de domínio específico.

## Conceitos Fundamentais

### Continuantes vs. Ocorrentes
- **Continuantes**: entidades que persistem no tempo (objetos, qualidades)
- **Ocurrentes**: entidades que se desdobram no tempo (processos, eventos)

### Hierarquia BFO
```
Entity
├── Continuant
│   ├── Independent Continuant
│   │   ├── Material Entity
│   │   └── Immaterial Entity
│   ├── Dependent Continuant
│   │   ├── Quality
│   │   └── Realizable Entity
│   └── Spatial Region
└── Occurrent
    ├── Process
    ├── Process Boundary
    └── Temporal Region
```

## Princípios de Design

1. **Realismo**: ontologias devem representar a realidade, não conceitos
2. **Fallibilismo**: o conhecimento é revisável
3. **Perspectivalismo adequado**: diferentes domínios, mesma estrutura base

## Aplicações
- Ontologias biomédicas (OBO Foundry)
- Interoperabilidade de dados científicos
- Integração de conhecimento multidisciplinar

> A BFO é usada como base para **mais de 350 ontologias** no domínio biomédico.