import { useState, useRef, useEffect } from 'react';

export default function SearchBar({ nodes, onSelect }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const results = query.length > 0
    ? nodes.filter((n) =>
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.group.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = (node) => {
    onSelect(node);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  return (
    <div className="search-bar" id="search-bar">
      <div className="search-input-wrapper">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Buscar notas... (Ctrl+K)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          id="search-input"
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Limpar busca"
          >
            ✕
          </button>
        )}
        <kbd className="search-kbd">⌘K</kbd>
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-results" ref={listRef} id="search-results">
          {results.map((node, i) => (
            <button
              key={node.id}
              className={`search-result-item ${i === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSelect(node)}
            >
              <span className="result-icon">{node.icon}</span>
              <div className="result-info">
                <span className="result-title">
                  {node.order ? `${node.order.toString().padStart(2, '0')} • ` : ''}{node.title}
                </span>
                <span className="result-group">{node.group}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length > 0 && results.length === 0 && (
        <div className="search-results" id="search-no-results">
          <div className="search-empty">
            <span>Nenhuma nota encontrada</span>
          </div>
        </div>
      )}
    </div>
  );
}
