import { useState, useCallback, useMemo } from 'react';
import { getGraphData } from '../lib/markdown';
import GraphView from '../components/GraphView';
import NoteSidebar from '../components/NoteSidebar';
import SearchBar from '../components/SearchBar';
import GroupLegend from '../components/GroupLegend';
import AudioPlayer from '../components/AudioPlayer';

export async function getStaticProps() {
  const graphData = getGraphData();
  return {
    props: {
      graphData,
    },
  };
}

export default function Home({ graphData }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightedGroup, setHighlightedGroup] = useState(null);
  const [searchHighlight, setSearchHighlight] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSecret, setShowSecret] = useState(false);

  // Extract unique groups
  const groups = useMemo(() => {
    const set = new Set(graphData.nodes.map((n) => n.group));
    return [...set].sort();
  }, [graphData]);

  // Handle node click (and background clear)
  const handleNodeClick = useCallback((node) => {
    if (node) {
      // Find the original node from our data to ensure reference consistency
      const originalNode = graphData.nodes.find((n) => n.id === node.id);
      setSelectedNode(originalNode || node);
      setSearchHighlight(null);
    } else {
      // Background click: CLEAR SELECTION
      setSelectedNode(null);
    }
  }, [graphData.nodes]);

  // Handle sidebar close
  const handleCloseSidebar = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle navigating to a connected note from sidebar
  const handleNavigate = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  // Handle search selection
  const handleSearchSelect = useCallback((node) => {
    setSelectedNode(node);
    setSearchHighlight(node.id);
    // Clear search highlight after animation
    setTimeout(() => setSearchHighlight(null), 2000);
  }, []);

  // Handle group filter
  const handleGroupClick = useCallback((group) => {
    setHighlightedGroup(prev => prev === group ? null : group);
  }, []);

  return (
    <div className="app" id="app">
      {/* Background gradient layer */}
      <div className="bg-gradient" />
      <div className="bg-stars-1" />
      <div className="bg-stars-2" />
      <div className="bg-stars-3" />
      <div className="bg-grid" />


      {/* Logo / Title */}
      <header className="app-header" id="app-header">
        <div className="logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="8" cy="8" r="3" fill="#a855f7" />
              <circle cx="24" cy="8" r="3" fill="#3b82f6" />
              <circle cx="16" cy="24" r="3" fill="#10b981" />
              <line x1="8" y1="8" x2="24" y2="8" stroke="#a855f7" strokeWidth="1.5" opacity="0.5" />
              <line x1="8" y1="8" x2="16" y2="24" stroke="#a855f7" strokeWidth="1.5" opacity="0.5" />
              <line x1="24" y1="8" x2="16" y2="24" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" />
            </svg>
          </div>
          <span className="logo-text">LinkPath</span>
        </div>
      </header>

      {/* Search */}
      <SearchBar
        nodes={graphData.nodes}
        onSelect={handleSearchSelect}
      />

      {/* Legend */}
      <GroupLegend
        groups={groups}
        onGroupClick={handleGroupClick}
        highlightedGroup={highlightedGroup}
      />

      {/* Sidebar */}
      {selectedNode && (
        <NoteSidebar
          note={selectedNode}
          allNodes={graphData.nodes}
          onClose={handleCloseSidebar}
          onNavigate={handleNavigate}
        />
      )}

      {/* Audio Player */}
      <AudioPlayer />

      {/* Instructions */}
      {showInstructions && (
        <div
          className="instructions"
          onClick={() => setShowInstructions(false)}
          title="Clique para ocultar"
        >
          <p><b>Scroll</b> para zoom • <b>Arraste</b> para mover • <b>Clique</b> em uma nota</p>
        </div>
      )}

      {/* Discreet About Button */}
      <button
        className="about-btn"
        onClick={() => setShowAbout(true)}
        title="Sobre o Autor"
      >
        Sobre
      </button>

      {/* Secret Modal */}
      {showSecret && (
        <div className="secret-overlay" onClick={() => setShowSecret(false)}>
          <div className="secret-modal" onClick={(e) => e.stopPropagation()}>
            <button className="secret-close" onClick={() => setShowSecret(false)}>×</button>
            <div className="secret-content">
              <span className="secret-icon">🌹</span>
              <p className="secret-text">
                Tu não te pareces nada com as mulheres vulgares que tenho conhecido.
                Espírito e coração como o teu são prendas raras, alma tão boa e tão elevada,
                sensibilidade tão melindrosa, razão tão reta não são bens que a natureza
                espalhasse às mãos cheias (...) a responsabilidade de fazer-te feliz é
                decerto melindrosa; mas eu aceito-a com alegria, e estou certo que saberei
                desempenhar este agradável encargo.<br /><br />
                <strong>R.I.S &lt;3</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <div className="about-overlay" onClick={() => setShowAbout(false)}>
          <div className="about-modal" onClick={(e) => e.stopPropagation()}>
            <button className="about-close" onClick={() => setShowAbout(false)}>×</button>
            <div className="about-content">
              {/* Para mudar a foto, basta trocar a URL no src abaixo */}
              <div className="about-avatar">
                <img
                  src="/drawing_me.png"
                  alt="Hugo Cardoso"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <span className="avatar-fallback">H</span>
              </div>
              <h2 className="about-author">Hugo Cardoso</h2>
              <p className="about-bio">Criador do LinkPath & Entusiasta de IA</p>

              <div className="about-links">
                <a href="https://github.com/TheHugoHypothesis" target="_blank" rel="noopener noreferrer" className="about-link github">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  GitHub
                </a>
                <a href="https://www.youtube.com/@PilhaNeural" target="_blank" rel="noopener noreferrer" className="about-link youtube">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"></path>
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
                  </svg>
                  YouTube
                </a>
              </div>
            </div>
            <div className="about-footer">
              LinkPath v1.0 • Otimizado para Estudo
              {/* Secret Flower Easter Egg - Now inside About Footer */}
              <span
                className="flower-btn-mini"
                onClick={() => setShowSecret(true)}
                title="S"
              >
                🌹
              </span>
            </div>
          </div>
        </div>
      )}


      {/* Graph - REORDERED TO BOTTOM FOR TOP PRIORITY EVENTS */}
      <GraphView
        data={graphData}
        onNodeClick={handleNodeClick}
        selectedNodeId={selectedNode?.id}
        highlightedGroup={highlightedGroup}
        searchHighlight={searchHighlight}
      />
    </div>
  );
}
