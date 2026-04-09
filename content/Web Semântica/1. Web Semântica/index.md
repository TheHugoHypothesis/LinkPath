---
title: "Web Semântica"
group: "Web Semântica"
links: ["websem2", "onto1", "logica2"]
video_url: ""
icon: "🌐"
order: 1
id: "websem1"
---

# Web Semântica

A **Web Semântica** é uma extensão da Web atual em que a informação tem significado bem definido, permitindo que computadores e pessoas cooperem melhor.

## Visão de Tim Berners-Lee

> "A Web Semântica não é uma Web separada, mas uma extensão da existente, na qual a informação recebe significado bem definido."

## Camadas da Web Semântica (Semantic Web Stack)

```
┌─────────────────────────┐
│      Trust / Proof      │
├─────────────────────────┤
│     Logic / Rules       │
├─────────────────────────┤
│    Ontologias (OWL)     │
├─────────────────────────┤
│     RDF Schema (RDFS)   │
├─────────────────────────┤
│    RDF / SPARQL         │
├─────────────────────────┤
│     XML / Namespaces    │
├─────────────────────────┤
│    URI / IRI / Unicode  │
└─────────────────────────┘
```

## Princípios dos Dados Linkados (Linked Data)

1. Usar **URIs** como nomes para as coisas
2. Usar **HTTP URIs** para que as pessoas possam buscar esses nomes
3. Quando alguém busca um URI, fornecer informação útil usando **RDF/SPARQL**
4. Incluir **links** a outros URIs para descobrir mais coisas

## Tecnologias Chave

| Tecnologia | Propósito |
|-----------|-----------|
| **URI/IRI** | Identificação global |
| **RDF** | Modelo de dados (triplas) |
| **RDFS** | Vocabulário básico |
| **OWL** | Ontologias formais |
| **SPARQL** | Consultas |
| **SHACL** | Validação de dados |

## Exemplos Práticos
- **DBpedia**: dados estruturados da Wikipedia
- **Wikidata**: base de conhecimento aberta
- **Schema.org**: marcação para buscadores

> A Web Semântica transforma a Web de **documentos** em uma Web de **dados interconectados**.
