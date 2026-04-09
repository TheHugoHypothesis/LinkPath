import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

/**
 * Recursive function to walk through the new folder structure:
 * content/[Group Name]/[Order. Topic Name]/index.md
 */
export function getGraphData() {
  const nodes = [];
  const links = [];
  const nodeIds = new Set();

  if (!fs.existsSync(contentDir)) return { nodes, links };

  // Read Top-Level Groups (Folders like "Inteligência Artificial")
  const groups = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());

  groups.forEach((groupEntry) => {
    const groupName = groupEntry.name;
    const groupPath = path.join(contentDir, groupName);

    // Read Topic Folders (Folders like "1. Introdução")
    const topics = fs.readdirSync(groupPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory());

    topics.forEach((topicEntry) => {
      const topicFolderName = topicEntry.name;
      const topicPath = path.join(groupPath, topicFolderName);

      // Extract Order and Title from folder name (e.g., "1. Redes Neurais")
      let order = 0;
      let folderTitle = topicFolderName;
      const orderMatch = topicFolderName.match(/^(\d+)\.\s*(.*)$/);
      if (orderMatch) {
        order = parseInt(orderMatch[1], 10);
        folderTitle = orderMatch[2];
      }

      // Find the single .md file inside this topic folder
      const files = fs.readdirSync(topicPath);
      const mdFile = files.find(f => f.endsWith('.md'));

      if (mdFile) {
        const raw = fs.readFileSync(path.join(topicPath, mdFile), 'utf-8');
        const { data, content } = matter(raw);
        
        // PRIORIDADE: id no YAML > pasta limpa. 
        // Se colocar id: "websem1" no Markdown, esse será o ID soberano.
        const id = data.id || folderTitle.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
          .replace(/[^a-z0-9]/g, '-'); // Remove caracteres especiais
        
        nodeIds.add(id);

        // REWRITE IMAGE URLs
        // Convert ![Alt](image.png) to ![Alt](/api/content/[Group]/[Topic]/image.png)
        const rewrittenContent = content.replace(
          /!\[(.*?)\]\((?!http|https|\/)(.+?)\)/g,
          (match, alt, imgPath) => {
             // Encode path segments to handle spaces/accents
             const encodedGroup = encodeURIComponent(groupName);
             const encodedTopic = encodeURIComponent(topicFolderName);
             const encodedImg = encodeURIComponent(imgPath);
             return `![${alt}](/api/content/${encodedGroup}/${encodedTopic}/${encodedImg})`;
          }
        );

          // Check for quiz.json
          let quiz = null;
          const quizPath = path.join(topicPath, 'quiz.json');
          if (fs.existsSync(quizPath)) {
            try {
              quiz = JSON.parse(fs.readFileSync(quizPath, 'utf-8'));
            } catch (e) {
              console.error(`Error parsing quiz.json in ${topicFolderName}:`, e);
            }
          }
  
          nodes.push({
            id,
            title: data.title || folderTitle,
            group: groupName, // Folder name is the MASTER group
            icon: data.icon || '📄',
            video_url: data.video_url || null,
            order: data.order || order, // Priority to frontmatter, fallback to folder prefix
            linkedIds: data.links || data.linkedIds || [],
            content: rewrittenContent,
            quiz, // Include quiz data if available
            _folderPath: topicFolderName, // Metadata for debugging
            _groupPath: groupName
          });
      }
    });
  });

  // Second pass: create edges (only if both nodes exist)
  nodes.forEach((node) => {
    if (node.linkedIds) {
      node.linkedIds.forEach((targetId) => {
        if (nodeIds.has(targetId)) {
          const exists = links.some(
            (l) =>
              (l.source === node.id && l.target === targetId) ||
              (l.source === targetId && l.target === node.id)
          );
          if (!exists) {
            links.push({ source: node.id, target: targetId });
          }
        }
      });
    }
  });

  // THIRD PASS: Create automatic sequence arrows (1 -> 2 -> 3) within each group
  const groupMap = {};
  nodes.forEach(node => {
    if (!groupMap[node.group]) groupMap[node.group] = [];
    groupMap[node.group].push(node);
  });

  Object.keys(groupMap).forEach(groupName => {
    const groupNodes = groupMap[groupName];
    // Sort by order (numeric)
    groupNodes.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Create arrows between sequential nodes
    for (let i = 0; i < groupNodes.length - 1; i++) {
      const source = groupNodes[i];
      const target = groupNodes[i+1];
      
      // Check if link already exists to avoid duplicate logic, but sequence is special
      const linkExists = links.find(l => 
        (l.source === source.id && l.target === target.id) || 
        (l.source === target.id && l.target === source.id)
      );

      if (linkExists) {
        // Tag existing manual link as sequence too if it matches the path
        linkExists.isSequence = true;
      } else {
        links.push({
          source: source.id,
          target: target.id,
          isSequence: true
        });
      }
    }
  });

  return { nodes, links };
}

/**
 * Re-implemented getNoteContent to search through the nested structure
 */
export function getNoteContent(id) {
  const { nodes } = getGraphData();
  return nodes.find(n => n.id === id) || null;
}