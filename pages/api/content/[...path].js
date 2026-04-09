import fs from 'fs';
import path from 'path';

/**
 * API to serve local assets from the /content directory
 * Usage: /api/content/Group/1. Topic/image.png
 */
export default function handler(req, res) {
  const { path: queryPath } = req.query;

  if (!queryPath || !Array.isArray(queryPath)) {
    return res.status(400).json({ error: 'Caminho inválido' });
  }

  // Final path construct
  const fullPath = path.join(process.cwd(), 'content', ...queryPath);

  // Security check: ensure the path is still within /content/
  if (!fullPath.startsWith(path.join(process.cwd(), 'content'))) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado' });
  }

  // Get extension to set correct Content-Type
  const ext = path.extname(fullPath).toLowerCase();
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';

  try {
    const fileBuffer = fs.readFileSync(fullPath);
    res.setHeader('Content-Type', contentType);
    // Cache for 1 hour to improve local performance
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(fileBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar o arquivo' });
  }
}
