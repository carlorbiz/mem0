import './StatusIndicator.css';

function StatusIndicator({ recording, syncStatus, online }) {
  const hasTranscription = syncStatus.untranscribed !== undefined;
  const transcribing = syncStatus.transcribing || false;
  const untranscribed = syncStatus.untranscribed || 0;

  return (
    <div className="status-indicator">
      <div className="status-grid">
        <div className={`status-card recording-status ${recording ? 'active' : ''}`}>
          <div className="status-icon">
            {recording ? '🔴' : '⏸️'}
          </div>
          <div className="status-label">
            {recording ? 'Recording...' : 'Listening'}
          </div>
        </div>

        {hasTranscription && (
          <div className={`status-card transcription-status ${transcribing ? 'active' : ''}`}>
            <div className="status-icon">
              {transcribing ? '✍️' : untranscribed > 0 ? '📝' : '✓'}
            </div>
            <div className="status-label">
              {transcribing && 'Transcribing...'}
              {!transcribing && untranscribed > 0 && `${untranscribed} to transcribe`}
              {!transcribing && untranscribed === 0 && 'All transcribed'}
            </div>
          </div>
        )}

        <div className={`status-card sync-status ${syncStatus.syncing ? 'active' : ''}`}>
          <div className="status-icon">
            {syncStatus.syncing ? '☁️' : syncStatus.pending > 0 ? '📦' : '✓'}
          </div>
          <div className="status-label">
            {syncStatus.syncing && 'Syncing...'}
            {!syncStatus.syncing && syncStatus.pending > 0 && `${syncStatus.pending} pending`}
            {!syncStatus.syncing && syncStatus.pending === 0 && 'All synced'}
          </div>
        </div>

        <div className={`status-card network-status ${online ? 'online' : 'offline'}`}>
          <div className="status-icon">
            {online ? '🌐' : '📡'}
          </div>
          <div className="status-label">
            {online ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusIndicator;
