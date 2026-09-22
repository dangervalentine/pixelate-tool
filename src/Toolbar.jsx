const Toolbar = ({
  hasImage,
  pixelSize,
  onPixelSizeChange,
  onChangeImage,
  onFullImage,
  onDownload,
  canDownload,
  isMobile,
}) => {
  const pct = ((pixelSize - 1) / 99) * 100;

  return (
    <div className="toolbar">
      <div className="toolbar-group slider-group">
        <span className="toolbar-label">Pixelation</span>
        <div className="range-wrap">
          <input
            className="range-input"
            type="range"
            min="1"
            max="100"
            value={pixelSize}
            onChange={(e) => onPixelSizeChange(Number(e.target.value))}
            disabled={!hasImage}
            style={{
              background: `linear-gradient(to right, var(--color-primary-main) 0%, var(--color-primary-main) ${pct}%, var(--color-border) ${pct}%, var(--color-border) 100%)`,
            }}
          />
          <span className="range-badge">{pixelSize}</span>
        </div>
      </div>

      <div className="toolbar-divider" />

      <button
        className="btn-ghost"
        onClick={onFullImage}
        disabled={!hasImage}
        aria-label="Full Image"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M2 5V3a1 1 0 011-1h2M11 2h2a1 1 0 011 1v2M14 11v2a1 1 0 01-1 1h-2M5 14H3a1 1 0 01-1-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {!isMobile && <span>Full Image</span>}
      </button>

      <div className="toolbar-divider" />

      {isMobile ? (
        // Hover-to-download doesn't work on touch, so mobile gets a button
        <button
          className="btn-ghost"
          onClick={onDownload}
          disabled={!canDownload}
          aria-label="Download"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v8M8 10l-3-3M8 10l3-3M3 13h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : (
        <button className="btn-ghost" onClick={onChangeImage}>
          <UploadIcon />
          <span>Upload</span>
        </button>
      )}
    </div>
  );
};

export const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 2v5M8 7L5.5 4.5M8 7l2.5-2.5M3 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Toolbar;
