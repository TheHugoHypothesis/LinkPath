---
title: "RDF e OWL"
group: "Web Semântica"
links: ["websem1", "onto1", "onto2", "logica2"]
video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
icon: "🔗"
order: 2
id: "websem2"
---

# RDF e OWL

**RDF** (Resource Description Framework) e **OWL** (Web Ontology Language) são os pilares tecnológicos da Web Semântica.

## RDF — Resource Description Framework

### Modelo de Triplas
Todo conhecimento é representado como **triplas**: `(Sujeito, Predicado, Objeto)`

```turtle
@prefix ex: <http://example.org/> .

ex:João  ex:temIdade  "30"^^xsd:integer .
ex:João  ex:conhece   ex:Maria .
ex:Maria rdf:type     ex:Pesquisadora .
```

### Formatos de Serialização
| Formato | Extensão | Legibilidade |
|---------|----------|-------------|
| **Turtle** | .ttl | Alta ✅ |
| **JSON-LD** | .jsonld | Para devs ✅ |
| **RDF/XML** | .rdf | Baixa ❌ |
| **N-Triples** | .nt | Simples |

### SPARQL — Consultas RDF
```sparql
SELECT ?nome ?idade
WHERE {
  ?pessoa rdf:type ex:Pesquisadora .
  ?pessoa ex:nome ?nome .
  ?pessoa ex:temIdade ?idade .
}
ORDER BY ?nome
```

## OWL — Web Ontology Language

### Perfis OWL 2
| Perfil | Complexidade | Uso |
|--------|-------------|-----|
| **OWL 2 EL** | Polinomial | Ontologias biomédicas grandes |
| **OWL 2 QL** | Consultas | Acesso a dados via SPARQL |
| **OWL 2 RL** | Regras | Sistemas baseados em regras |
| **OWL 2 DL** | Decidível | Expressividade máxima decidível |
| **OWL 2 Full** | Indecidível | Sem restrições |

### Exemplos de Axiomas OWL
```xml
<!-- Classe -->
<owl:Class rdf:about="#Pessoa"/>

<!-- Subclasse -->
<owl:Class rdf:about="#Estudante">
  <rdfs:subClassOf rdf:resource="#Pessoa"/>
</owl:Class>

<!-- Propriedades -->
<owl:ObjectProperty rdf:about="#orientadoPor">
  <rdfs:domain rdf:resource="#Estudante"/>
  <rdfs:range rdf:resource="#Professor"/>
</owl:ObjectProperty>
```

> RDF fornece o **modelo de dados**, OWL fornece a **semântica formal** — juntos, eles habilitam a Web Semântica.
