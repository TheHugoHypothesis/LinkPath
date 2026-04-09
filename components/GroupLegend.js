import { useState } from 'react';

const GROUP_COLORS = {
  'Ontologias': '#a855f7',
  'Lógica': '#3b82f6',
  'Web Semântica': '#10b981',
  'Inteligência Artificial': '#f59e0b',
};

export default function GroupLegend({ groups, activeGroup, onGroupClick, nodeCount }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`group-legend ${collapsed ? 'collapsed' : ''}`} id="group-legend">
      <button
        className="legend-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expandir legenda' : 'Recolher legenda'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          {collapsed ? (
            <polyline points="9 18 15 12 9 6" />
          ) : (
            <polyline points="15 18 9 12 15 6" />
          )}
        </svg>
      </button>

      {!collapsed && (
        <>
          <div className="legend-header">
            <div className="legend-header-left">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
              </svg>
              <span>Grupos</span>
            </div>
            
            {activeGroup && (
              <button 
                className="legend-reset-btn"
                onClick={() => onGroupClick(null)}
                title="Mostrar todos os grupos"
              >
                Limpar
              </button>
            )}
          </div>
          
          <div className="legend-items">
            {groups.map((group) => {
              const color = GROUP_COLORS[group] || '#6b7280';
              const isActive = activeGroup === group;

              return (
                <button
                  key={group}
                  className={`legend-item ${isActive ? 'active' : ''}`}
                  onClick={() => onGroupClick(group)}
                  style={{ '--legend-color': color }}
                >
                  <span className="legend-dot" style={{ backgroundColor: color }}></span>
                  <span className="legend-label">{group}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
