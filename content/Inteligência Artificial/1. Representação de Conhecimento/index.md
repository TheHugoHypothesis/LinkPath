---
title: "Representação de Conhecimento"
group: "Inteligência Artificial"
links: ["onto1", "onto2", "logica3", "websem1"]
video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
icon: "🧠"
order: 1
id: "ia1"
---

# Representação de Conhecimento (KR)

A **Representação de Conhecimento** (Knowledge Representation) é a área da IA que estuda como codificar conhecimento em formatos que sistemas computacionais possam processar.

## Papel na IA

A KR é um dos **pilares clássicos da IA simbólica**, junto com:
- Busca e planejamento
- Raciocínio e inferência
- Aprendizado de máquina

## Formalismos de Representação

### 1. Lógica
- Lógica proposicional e de primeira ordem
- Lógicas de descrição (base do OWL)
- Lógica modal e temporal

### 2. Redes Semânticas
Grafos onde:
- **Nós** = conceitos
- **Arestas** = relações

```
   Mamífero
     ↑ é-um
   Cachorro
     ↑ instância-de
   Rex ──tem-dono──→ João
```

### 3. Frames (Minsky, 1975)
Estruturas com slots e valores padrão:
```
Frame: Cachorro
  é-um: Mamífero
  patas: 4 (default)
  som: "latido"
  [se-modificado: verificar_consistência]
```

### 4. Ontologias
Representação formal, compartilhável e reutilizável do conhecimento.

### 5. Knowledge Graphs
Grafos de conhecimento em larga escala (Google KG, DBpedia, Wikidata).

## Critérios de Qualidade (Randall Davis, 1993)

1. **Substituto**: representar a coisa no lugar da coisa real
2. **Compromissos ontológicos**: decisões sobre o que existe
3. **Fragmentary theory**: raciocínio inteligente sobre o representado
4. **Eficiência computacional**: ser processável na prática
5. **Expressividade**: poder representar o necessário

## Tendências Atuais
- **Neuro-Simbólica**: combinar deep learning com KR
- **Knowledge Graph Embeddings**: representar KGs em espaços vetoriais
- **LLMs + KR**: usar LLMs para popular/consultar bases de conhecimento

> KR é a ponte entre o **conhecimento humano** e a **inteligência artificial**.
