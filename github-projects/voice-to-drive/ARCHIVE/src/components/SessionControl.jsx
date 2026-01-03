import './SessionControl.css';

function SessionControl({ active, onStart, onEnd, disabled }) {
  return (
    <div className="session-control">
      {!active ? (
        <button
          onClick={onStart}
          className="btn-start"
          disabled={disabled}
        >
          <span className="btn-icon">🎙️</span>
          <span className="btn-text">Start Session</span>
        </button>
      ) : (
        <button onClick={onEnd} className="btn-end">
          <span className="btn-icon">⏹️</span>
          <span className="btn-text">End Session</span>
        </button>
      )}
    </div>
  );
}

export default SessionControl;
