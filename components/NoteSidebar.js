import { useMemo, useState } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/tokyo-night-dark.css';
import markedKatex from 'marked-katex-extension';
import 'katex/dist/katex.min.css';
import VideoPlayer from './VideoPlayer';
import QuizSection from './QuizSection';

// Configure marked with highlight.js and KaTeX
marked.use(markedKatex({ 
  throwOnError: false,
  strict: false // Permite caracteres acentuados dentro de \text{} ou similares
}));

marked.use({
  renderer: {
    code(code, lang) {
      const text = code || '';
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      try {
        const highlighted = hljs.highlight(text, { language }).value;
        return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
      } catch (e) {
        return `<pre><code class="hljs">${text}</code></pre>`;
      }
    }
  }
});

// Group color palette (keep in sync with GraphView)
const GROUP_COLORS = {
  'Ontologias': '#a855f7',
  'Lógica': '#3b82f6',
  'Web Semântica': '#10b981',
  'Inteligência Artificial': '#f59e0b',
};

export default function NoteSidebar({ note, allNodes, onClose, onNavigate }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const htmlContent = useMemo(() => {
    if (!note?.content) return '';

    // Configure remains of marked
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    return marked.parse(note.content);
  }, [note?.content]);

  const handleExport = () => {
    if (!note?.content) return;
    const blob = new Blob([note.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title || 'nota'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!note) return null;

  const groupColor = GROUP_COLORS[note.group] || '#6b7280';

  // Find connected notes
  const connectedNotes = useMemo(() => {
    if (!note.linkedIds || !allNodes) return [];
    return note.linkedIds
      .map((id) => allNodes.find((n) => n.id === id))
      .filter(Boolean);
  }, [note, allNodes]);

  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <aside
        className={`note-sidebar ${isFullscreen ? 'fullscreen' : ''}`}
        onClick={(e) => e.stopPropagation()}
        id="note-sidebar"
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-controls">
            <button 
              className="sidebar-export-btn" 
              onClick={handleExport}
              aria-label="Exportar Markdown"
              title="Baixar Nota (.md)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            </button>
            <button 
              className="sidebar-fullscreen-btn" 
              onClick={() => setIsFullscreen(!isFullscreen)}
              aria-label={isFullscreen ? "Recolher" : "Tela Cheia"}
              title={isFullscreen ? "Recolher" : "Modo Estudo (Tela Cheia)"}
            >
              {isFullscreen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              )}
            </button>
            <button className="sidebar-close" onClick={onClose} aria-label="Fechar" id="sidebar-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <h1 className="sidebar-title">
            {note.order ? `${note.order.toString().padStart(2, '0')} • ` : ''}{note.title}
          </h1>
          <span className="sidebar-group" style={{ '--group-color': groupColor }}>
            <span className="group-dot" style={{ backgroundColor: groupColor }}></span>
            {note.group}
          </span>
        </div>

        {/* Video */}
        {note.video_url && (
          <div className="sidebar-video">
            <VideoPlayer url={note.video_url} />
          </div>
        )}

        {/* Content */}
        <div
          className="sidebar-content markdown-body"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Interactive Quiz */}
        {note.quiz && (
          <div className="sidebar-quiz-section">
            <QuizSection quiz={note.quiz} />
          </div>
        )}

        {/* Connected Notes */}
        {connectedNotes.length > 0 && (
          <div className="sidebar-connections">
            <h3 className="connections-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Notas Relacionadas
            </h3>
            <div className="connections-grid">
              {connectedNotes.map((cn) => (
                <button
                  key={cn.id}
                  className="connection-card"
                  onClick={() => onNavigate(cn)}
                  style={{ '--card-color': GROUP_COLORS[cn.group] || '#6b7280' }}
                >
                  <span className="connection-icon">{cn.icon}</span>
                  <div className="connection-info">
                    <span className="connection-title">{cn.title}</span>
                    <span className="connection-group">{cn.group}</span>
                  </div>
                  <svg className="connection-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
