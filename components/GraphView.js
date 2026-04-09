import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { forceCollide } from 'd3-force';

// Dynamically import to avoid SSR issues with canvas
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => (
    <div className="graph-loading">
      <div className="graph-loading-spinner"></div>
      <p>Carregando grafo...</p>
    </div>
  ),
});

const GROUP_COLORS = {
  'Ontologias': { main: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)', bg: 'rgba(168, 85, 247, 0.08)' },
  'Lógica': { main: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)', bg: 'rgba(59, 130, 246, 0.08)' },
  'Web Semântica': { main: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', bg: 'rgba(16, 185, 129, 0.08)' },
  'Inteligência Artificial': { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', bg: 'rgba(245, 158, 11, 0.08)' },
};

const DEFAULT_COLOR = { main: '#6b7280', glow: 'rgba(107, 114, 128, 0.4)', bg: 'rgba(107, 114, 128, 0.08)' };

function getGroupColor(group) {
  return GROUP_COLORS[group] || DEFAULT_COLOR;
}

export default function GraphView({ data, onNodeClick, selectedNodeId, highlightedGroup, searchHighlight }) {
  const graphRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Elite Feature: Ripple State (Ref for performance)
  const ripples = useRef([]);
  const triggerRipple = (nodeId) => {
    ripples.current.push({ nodeId, startTime: Date.now(), duration: 1800 });
    if (ripples.current.length > 8) ripples.current.shift();
  };

  // Resize handler
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Elite: 3-Layer Parallax Engine Sync (at 60fps)
  const syncGalaxy = useCallback(() => {
    const fg = graphRef.current;
    if (fg && typeof fg.getTransform === 'function') {
      const { x, y } = fg.getTransform();
      // Level 1: Distant stars (25% move)
      document.documentElement.style.setProperty('--px-1', `${x * 0.25}px`);
      document.documentElement.style.setProperty('--py-1', `${y * 0.25}px`);
      // Level 2: Medium layers (50% move)
      document.documentElement.style.setProperty('--px-2', `${x * 0.5}px`);
      document.documentElement.style.setProperty('--py-2', `${y * 0.5}px`);
      // Level 3: Close nebulae/dust (80% move)
      document.documentElement.style.setProperty('--px-3', `${x * 0.8}px`);
      document.documentElement.style.setProperty('--py-3', `${y * 0.8}px`);
    }
  }, []);

  // Custom forces
  useEffect(() => {
    let cancelled = false;
    const applyForces = () => {
      const fg = graphRef.current;
      if (!fg || typeof fg.d3Force !== 'function') return false;
      fg.d3Force('charge').strength(-300).distanceMax(400);
      fg.d3Force('link').distance(100);
      fg.d3Force('collide', forceCollide(node => 35)); // Avoid label/node overlap
      fg.d3Force('cluster', (alpha) => {
        const groups = {};
        data.nodes.forEach((node) => {
          if (!groups[node.group]) groups[node.group] = [];
          groups[node.group].push(node);
        });
        Object.values(groups).forEach((groupNodes) => {
          let cx = 0, cy = 0;
          groupNodes.forEach((n) => { cx += n.x || 0; cy += n.y || 0; });
          cx /= groupNodes.length; cy /= groupNodes.length;
          groupNodes.forEach((node) => {
            node.vx = (node.vx || 0) + (cx - (node.x || 0)) * alpha * 0.3;
            node.vy = (node.vy || 0) + (cy - (node.y || 0)) * alpha * 0.3;
          });
        });
      });
      setTimeout(() => { if (!cancelled && fg.zoomToFit) fg.zoomToFit(600, 80); }, 1000);
      return true;
    };
    if (!applyForces()) {
      const interval = setInterval(() => { if (cancelled || applyForces()) clearInterval(interval); }, 200);
      setTimeout(() => clearInterval(interval), 5000);
    }
    return () => { cancelled = true; };
  }, [data]);

  // Zoom to node
  useEffect(() => {
    if (selectedNodeId && graphRef.current) {
      const fg = graphRef.current;
      if (typeof fg.centerAt !== 'function') return;
      const node = data.nodes.find((n) => n.id === selectedNodeId);
      if (node && isFinite(node.x) && isFinite(node.y)) {
        fg.centerAt(node.x, node.y, 800);
        if (typeof fg.zoom === 'function') fg.zoom(2.5, 800);
      }
    }
  }, [selectedNodeId, data]);

  const isExcludedByFilter = useCallback((node) => {
    const hasSearch = !!searchHighlight;
    const hasGroup = !!highlightedGroup;
    if (!hasSearch && !hasGroup) return false;
    if (hasSearch && searchHighlight === node.id) return false;
    if (hasGroup && node.group === highlightedGroup) return false;
    return true;
  }, [searchHighlight, highlightedGroup]);

  const getConnectedDetails = useMemo(() => {
    if (!selectedNodeId) return { nodes: new Set(), links: new Set() };
    const nodes = new Set([selectedNodeId]);
    const links = new Set();
    data.links.forEach((l) => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      if (s === selectedNodeId || t === selectedNodeId) {
        nodes.add(s); nodes.add(t); links.add(l);
      }
    });
    return { nodes, links };
  }, [selectedNodeId, data.links]);

  const isExcludedByFocus = useCallback((nodeId) => {
    if (!selectedNodeId) return false;
    return !getConnectedDetails.nodes.has(nodeId);
  }, [selectedNodeId, getConnectedDetails]);

  const isFinitePos = (node) => isFinite(node?.x) && isFinite(node?.y);

  const paintNode = useCallback((node, ctx, globalScale) => {
    if (!isFinitePos(node)) return;
    const isSelected = node.id === selectedNodeId;
    const isHovered = node.id === hoveredNode;
    const isPinned = !!node.isManuallyPinned;
    const color = getGroupColor(node.group);

    // --- AMBIENT AURA PARTICLES (The "Bolinhas" that drift from nodes) ---
    if (!node._aura) node._aura = [];
    
    // Spawn new particle occasionally (Zen-like rate)
    if (Math.random() > 0.992) {
      const sourceId = node.id;
      const connectedLinks = data.links.filter(l => 
        (l.source.id || l.source) === sourceId || (l.target.id || l.target) === sourceId
      );
      
      let vx = (Math.random() - 0.5) * 0.05;
      let vy = (Math.random() - 0.5) * 0.05;
      
      if (connectedLinks.length > 0) {
        const randomLink = connectedLinks[Math.floor(Math.random() * connectedLinks.length)];
        const targetNode = (randomLink.source.id || randomLink.source) === sourceId ? randomLink.target : randomLink.source;
        
        if (targetNode && isFinite(targetNode.x)) {
          const dx = targetNode.x - node.x;
          const dy = targetNode.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0) {
            // ZEN SPEED: Very slow
            const speed = 0.15 + Math.random() * 0.1;
            vx = (dx / dist) * speed;
            vy = (dy / dist) * speed;
          }
        }
      }

      node._aura.push({
        x: 0, y: 0,
        vx, vy,
        life: 1.0,
        size: Math.random() * 1.0 + 1.0 // Slightly larger for better noticeability
      });
    }

    // Update and Draw Aura Particles
    ctx.save();
    for (let i = node._aura.length - 1; i >= 0; i--) {
      const p = node._aura[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.006; // Keep the same slow pace

      if (p.life <= 0) {
        node._aura.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(node.x + p.x, node.y + p.y, p.size / globalScale, 0, 2 * Math.PI);
      ctx.fillStyle = color.main;
      ctx.globalAlpha = p.life * 0.45; // Slightly more noticeable
      ctx.fill();
    }
    ctx.restore();

    let alpha = 1;
    const isFiltered = !!searchHighlight || !!highlightedGroup;
    const isFocused = !!selectedNodeId;
    if ((isFiltered && isExcludedByFilter(node)) || (isFocused && isExcludedByFocus(node.id))) {
      alpha = 0.35;
    }
    if (isSelected || isHovered) alpha = 1;

    const radius = isSelected ? 10 : isHovered ? 9 : 7;

    ctx.save();
    ctx.globalAlpha = alpha;

    ripples.current.forEach(ripple => {
      if (ripple.nodeId === node.id) {
        const elapsed = Date.now() - ripple.startTime;
        const progress = elapsed / ripple.duration;
        if (progress < 1) {
          ctx.beginPath(); ctx.arc(node.x, node.y, radius + (progress * 60), 0, 2 * Math.PI);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * (1 - progress)})`;
          ctx.lineWidth = 2 / globalScale; ctx.stroke();
        }
      }
    });

    if (isSelected || isHovered) {
      ctx.beginPath(); ctx.arc(node.x, node.y, radius + 8, 0, 2 * Math.PI);
      const gradient = ctx.createRadialGradient(node.x, node.y, radius, node.x, node.y, radius + 8);
      gradient.addColorStop(0, color.glow); gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient; ctx.fill();
    }

    ctx.beginPath(); ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    const grad = ctx.createRadialGradient(node.x - 2, node.y - 2, 0, node.x, node.y, radius);
    grad.addColorStop(0, lightenColor(color.main, 40)); grad.addColorStop(1, color.main);
    ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = isSelected ? '#ffffff' : lightenColor(color.main, 60);
    ctx.lineWidth = isSelected ? 2.5 / globalScale : 1 / globalScale;
    ctx.stroke();

    if (isPinned) {
      ctx.font = `${radius * 0.8}px serif`;
      ctx.fillText('📌', node.x + radius / 2, node.y - radius);
    }

    if (globalScale > 0.6 && node.icon) {
      ctx.font = `${radius * 1.1}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white'; ctx.fillText(node.icon, node.x, node.y + 0.5);
    }
    ctx.restore();
  }, [selectedNodeId, hoveredNode, isExcludedByFilter, isExcludedByFocus, getConnectedDetails, data.links]);

  // NEW: Final pass for labels to avoid node overlap
  const paintLabels = useCallback((ctx, globalScale) => {
    if (globalScale < 0.4) return; // Hide labels at large scale to avoid clutter

    data.nodes.forEach(node => {
      if (!isFinitePos(node)) return;

      const isSelected = node.id === selectedNodeId;
      const isHovered = node.id === hoveredNode;
      
      let alpha = 1;
      const isFiltered = !!searchHighlight || !!highlightedGroup;
      const isFocused = !!selectedNodeId;
      if ((isFiltered && isExcludedByFilter(node)) || (isFocused && isExcludedByFocus(node.id))) {
        alpha = 0.35;
      }
      if (isSelected || isHovered) alpha = 1;

      const radius = isSelected ? 10 : isHovered ? 9 : 7;
      const fontSize = Math.max(8.5 / globalScale, 2.5); // Reduced from 11 for a cleaner look
      
      ctx.save();
      ctx.font = `600 ${fontSize}px 'Inter', sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';

      const orderPrefix = node.order ? `${node.order.toString().padStart(2, '0')} • ` : '';
      const label = orderPrefix + (node.title || node.id);

      const textWidth = ctx.measureText(label).width;
      const padding = 3 / globalScale; // Slightly reduced padding
      
      // Label Background (Always drawn on top of node bodies)
      ctx.fillStyle = 'rgba(10, 10, 26, 0.85)';
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      roundRect(ctx, node.x - textWidth / 2 - padding, node.y + radius + 4, textWidth + padding * 2, fontSize + padding * 2, 4 / globalScale);
      ctx.fill();
      
      // Label Text
      ctx.fillStyle = (alpha < 1) ? 'rgba(255,255,255,0.3)' : '#f8fafc';
      ctx.fillText(label, node.x, node.y + radius + 4 + padding);
      ctx.restore();
    });
  }, [selectedNodeId, hoveredNode, isExcludedByFilter, isExcludedByFocus, getConnectedDetails, searchHighlight, highlightedGroup, data.nodes]);

  const paintLink = useCallback((link, ctx, globalScale) => {
    const sNode = typeof link.source === 'object' ? link.source : data.nodes.find(n => n.id === link.source);
    const tNode = typeof link.target === 'object' ? link.target : data.nodes.find(n => n.id === link.target);
    if (!sNode || !tNode || !isFinitePos(sNode) || !isFinitePos(tNode)) return;

    const isFiltered = !!searchHighlight || !!highlightedGroup;
    const isFocused = !!selectedNodeId;
    let isActive = true;
    if (isFiltered) isActive = !isExcludedByFilter(sNode) && !isExcludedByFilter(tNode);
    if (isFocused) isActive = getConnectedDetails.links.has(link);
    const isConnHover = hoveredNode && (sNode.id === hoveredNode || tNode.id === hoveredNode);
    const isConnSel = selectedNodeId && (sNode.id === selectedNodeId || tNode.id === selectedNodeId);

    ctx.beginPath(); ctx.moveTo(sNode.x, sNode.y); ctx.lineTo(tNode.x, tNode.y);

    // SEQUENCE LINK: Colored and solid arrows
    if (link.isSequence) {
      const color = getGroupColor(sNode.group).main;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 / globalScale;
      ctx.globalAlpha = (isFiltered || isFocused) && !isActive ? 0.2 : 0.8;
    }
    // RELATION LINK: Subtle and grey
    else if (isConnHover || isConnSel) {
      ctx.strokeStyle = getGroupColor(sNode.group).main;
      ctx.lineWidth = 3 / globalScale; ctx.globalAlpha = 1;
    } else {
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)'; ctx.lineWidth = 0.5 / globalScale;
      ctx.globalAlpha = (isFiltered || isFocused) && !isActive ? 0.3 : 0.6;
    }
    ctx.stroke();

    ripples.current.forEach(ripple => {
      if (ripple.nodeId === sNode.id || ripple.nodeId === tNode.id) {
        const elapsed = Date.now() - ripple.startTime;
        const progress = elapsed / ripple.duration;
        if (progress > 0 && progress < 1) {
          ctx.save(); ctx.setLineDash([10, 20]);
          ctx.lineDashOffset = -progress * 100;
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * (1 - progress)})`;
          ctx.lineWidth = 3 / globalScale; ctx.stroke(); ctx.restore();
        }
      }
    });
  }, [hoveredNode, selectedNodeId, data, getConnectedDetails, isExcludedByFilter, highlightedGroup, searchHighlight]);

  return (
    <div className="graph-container" id="graph-container" style={{ zIndex: 10, position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
      <ForceGraph2D
        ref={graphRef}
        width={dimensions.width} height={dimensions.height}
        nodeRelSize={12} graphData={data} nodeId="id"
        nodeCanvasObject={paintNode}
        onRenderFramePre={syncGalaxy}
        onRenderFramePost={paintLabels}
        nodePointerAreaPaint={(node, color, ctx) => {
          ctx.beginPath(); ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
          ctx.fillStyle = color; ctx.fill();
        }}
        linkCanvasObject={paintLink}
        onNodeClick={(node, event) => {
          if (node && (event.ctrlKey || event.metaKey)) {
            // Pinning: CTRL + CLICK
            const isPinned = !!node.isManuallyPinned;
            if (isPinned) {
              node.fx = null; node.fy = null;
              node.isManuallyPinned = false;
            } else {
              node.fx = node.x; node.fy = node.y;
              node.isManuallyPinned = true;
            }
            triggerRipple(node.id);
          } else {
            // Selection: SIMPLE CLICK
            if (node) triggerRipple(node.id);
            onNodeClick(node);
          }
        }}
        onNodeHover={(node) => {
          setHoveredNode(node ? node.id : null);
          document.body.style.cursor = node ? 'pointer' : 'default';
          if (node) {
            document.title = `LinkPath | ${node.title || node.id} (Ctrl+Click to Pin)`;
          } else {
            document.title = 'LinkPath | Knowledge Graph';
          }
        }}
        onBackgroundClick={() => onNodeClick(null)}
        onNodeDragStart={(node) => {
          // Store original pinning state to know if we should release after drag
          // We check if it WAS pinned before the drag started
          node.__wasPinnedWhenStarted = !!node.isManuallyPinned;
        }}
        onNodeDragEnd={(node) => {
          // If it wasn't pinned before, we must release it
          if (!node.__wasPinnedWhenStarted) {
            node.fx = null;
            node.fy = null;
          }
          delete node.__wasPinnedWhenStarted;
        }}
        cooldownTicks={100} warmupTicks={50}
        enableZoomInteraction={true} enablePanInteraction={true}
        backgroundColor="transparent"
        linkDirectionalArrowLength={(link) => (link.isSequence ? 5 : 0)}
        linkDirectionalArrowRelPos={1}
        linkDirectionalParticles={(link) => {
          if (link.isSequence) return 3;
          return (selectedNodeId && getConnectedDetails.links.has(link) ? 5 : 0);
        }}
        linkDirectionalParticleWidth={(link) => (link.isSequence ? 1.5 : 2)}
        linkDirectionalParticleSpeed={(link) => {
          const isFocused = selectedNodeId && getConnectedDetails.links.has(link);
          const baseSpeed = link.isSequence ? 0.005 : (isFocused ? 0.008 : 0.004);
          const id = (link.source.id || link.source) + (link.target.id || link.target);
          let hash = 0;
          for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
          const variance = (Math.abs(hash) % 100) / 20000;
          return baseSpeed + variance;
        }}
        linkDirectionalParticleColor={(link) => {
          const s = typeof link.source === 'object' ? link.source : data.nodes.find(n => n.id === link.source);
          return s ? getGroupColor(s.group).main : '#6b7280';
        }}
      />
    </div>
  );
}

function lightenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `rgb(${R},${G},${B})`;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}