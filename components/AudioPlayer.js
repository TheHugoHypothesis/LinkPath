import { useState, useRef, useEffect } from 'react';

/**
 * Premium Audio Player for LinkPath
 * Handles background ambient music (Interstellar style)
 */
export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  // Note: Most browsers block autoPlay until the first user interaction.
  // Clicking the mute/unmute button will trigger the playback.
  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      // Unmuting for the first time or resuming
      audio.muted = false;
      audio.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
      }).catch(err => {
        console.log("Audio play blocked by browser. Interaction required.", err);
      });
    } else {
      // Muting
      audio.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <div className="audio-container" id="audio-player">
      <audio 
        ref={audioRef} 
        src="/audio/interstellar_inception.mp3" 
        loop 
        muted={isMuted}
      />
      <button 
        className={`audio-toggle-btn ${!isMuted ? 'active' : ''}`}
        onClick={toggleAudio}
        title={isMuted ? "Ativar som ambiente" : "Mutar som"}
      >
        <div className="audio-icon-wrapper">
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <div className="audio-active-waves">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <div className="music-bars">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
        {!isMuted && <span className="audio-label">Ambiente</span>}
      </button>
    </div>
  );
}
