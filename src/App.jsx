import { useEffect, useCallback, useState, useRef } from "react";
import Header from "./Header";
import Toolbar from "./Toolbar";
import Selection from "./Selection";
import { useMediaQuery } from "./hooks/useMediaQuery";

import "./App.css";
import upload from "./upload.svg";

let imgSrc;

const DownloadOverlay = ({ onClick }) => (
  <div className="download-overlay" onClick={onClick}>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 4v16M16 20l-6-6M16 20l6-6M4 26h24"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span>Download</span>
  </div>
);

const App = () => {
  const isMobile = useMediaQuery("(max-width: 800px)");
  const [fileName, setFileName] = useState("");
  const [image, setImage] = useState("");
  const [pixelSize, setPixelSize] = useState(8);
  const [selectionRect, setSelectionRect] = useState(null);
  const [compositeUrl, setCompositeUrl] = useState(null);
  const photoContainer = useRef(null);
  const imageWrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const loadImage = useCallback(
    (file) => {
      if (!file && !imgSrc) return;

      if (file) {
        imgSrc = URL.createObjectURL(file);
      }

      setFileName(file?.name ?? fileName);
      setImage(imgSrc);
      setSelectionRect({ x: 0, y: 0, w: 100, h: 100 });
    },
    [fileName]
  );

  const applySelection = useCallback(
    (selRect) => {
      if (!selRect || !canvasRef.current || !imgSrc) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.onload = () => {
        const width = (canvas.width = img.width);
        const height = (canvas.height = img.height);

        ctx.drawImage(img, 0, 0, width, height);

        const sx = Math.round((selRect.x / 100) * width);
        const sy = Math.round((selRect.y / 100) * height);
        const sw = Math.round((selRect.w / 100) * width);
        const sh = Math.round((selRect.h / 100) * height);

        if (sw < 1 || sh < 1) return;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = sw;
        tempCanvas.height = sh;
        const tempCtx = tempCanvas.getContext("2d");

        tempCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

        const maxDim = Math.max(sw, sh);
        const pw = Math.max(1, Math.round((sw * pixelSize) / maxDim));
        const ph = Math.max(1, Math.round((sh * pixelSize) / maxDim));

        tempCtx.drawImage(tempCanvas, 0, 0, pw, ph);
        tempCtx.imageSmoothingEnabled = false;
        tempCtx.drawImage(tempCanvas, 0, 0, pw, ph, 0, 0, sw, sh);

        ctx.drawImage(tempCanvas, 0, 0, sw, sh, sx, sy, sw, sh);

        setCompositeUrl(canvas.toDataURL("image/png"));
      };
      img.src = imgSrc;
    },
    [canvasRef, pixelSize]
  );

  useEffect(() => {
    if (!selectionRect) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      applySelection(selectionRect);
    }, 80);
    return () => clearTimeout(debounceRef.current);
  }, [selectionRect, pixelSize, applySelection]);

  const onChange = (e) => {
    if (!e.target.files.length) return;
    loadImage(e.target.files[0]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (!e.dataTransfer) return;
    loadImage(e.dataTransfer.files[0]);
    photoContainer.current.classList.remove("drag-over");
  };

  const onDragOver = (e) => {
    e.preventDefault();
    photoContainer.current.classList.add("drag-over");
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    photoContainer.current.classList.remove("drag-over");
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const hasImage = fileName !== "";
  const canDownload = hasImage && compositeUrl;

  const onSelectionChange = useCallback((rect) => {
    setSelectionRect(rect);
  }, []);

  const handleOriginalPaneClick = useCallback(() => {
    if (!hasImage) {
      inputRef.current?.click();
    }
  }, [hasImage]);

  const rightSrc = compositeUrl || image;

  let helperContent;
  if (!hasImage) {
    helperContent = (
      <span className="helper-step">Drop an image here or click to upload</span>
    );
  } else {
    helperContent = isMobile ? (
      <span className="helper-step">Drag to move, pull corners to resize</span>
    ) : (
      <>
        <span className="helper-step">Drag selection to move</span>
        <span className="helper-dot" />
        <span className="helper-step">Pull corners to resize</span>
        <span className="helper-dot" />
        <span className="helper-step">Hover preview to save</span>
      </>
    );
  }

  const desktopView = (
    <div className="split-view">
      <div className="split-pane original-pane" onClick={handleOriginalPaneClick}>
        <div className="pane-label">{hasImage ? "Original" : "Upload"}</div>
        {hasImage ? (
          <div ref={imageWrapperRef} className="image-wrapper">
            <img className="image-file" src={image} alt="original" />
            <Selection
              rect={selectionRect}
              onChange={onSelectionChange}
              containerRef={imageWrapperRef}
            />
          </div>
        ) : (
          <div className="empty-state">
            <img src={upload} alt="upload" />
            <div className="image-text">
              <span className="bold">Choose a file</span>
              <div className="tagline">or drag it here</div>
            </div>
          </div>
        )}
      </div>
      <div className="split-pane preview-pane">
        <div className="pane-label">Preview</div>
        {hasImage ? (
          <div className="image-wrapper downloadable">
            <img
              className="image-file preview-img"
              src={rightSrc}
              alt="pixelated preview"
            />
            {canDownload && <DownloadOverlay onClick={downloadImage} />}
          </div>
        ) : (
          <div className="empty-preview">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
              <rect x="12" y="12" width="10" height="10" rx="1" fill="currentColor" opacity="0.15" />
              <rect x="26" y="12" width="10" height="10" rx="1" fill="currentColor" opacity="0.15" />
              <rect x="12" y="26" width="10" height="10" rx="1" fill="currentColor" opacity="0.15" />
              <rect x="26" y="26" width="10" height="10" rx="1" fill="currentColor" opacity="0.15" />
            </svg>
            <span>Your pixelated result will appear here</span>
          </div>
        )}
      </div>
    </div>
  );

  const mobileView = hasImage ? (
    <div className="mobile-center">
      <div ref={imageWrapperRef} className="image-wrapper downloadable">
        <img
          className="image-file"
          src={compositeUrl || image}
          alt="pixelated"
        />
        <Selection
          rect={selectionRect}
          onChange={onSelectionChange}
          containerRef={imageWrapperRef}
        />
        {canDownload && (
          <DownloadOverlay onClick={downloadImage} />
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="app-shell">
      <Header />
      <Toolbar
        hasImage={hasImage}
        pixelSize={pixelSize}
        onPixelSizeChange={setPixelSize}
        onChangeImage={() => inputRef.current?.click()}
        onFullImage={() => setSelectionRect({ x: 0, y: 0, w: 100, h: 100 })}
        isMobile={isMobile}
      />
      <div className="helper-bar">
        <div className="helper-text">{helperContent}</div>
      </div>
      <div className="container">
        <div
          ref={photoContainer}
          className="photo-container"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {isMobile ? (
            hasImage ? mobileView : (
              <div className="photo border" onClick={() => inputRef.current?.click()}>
                <div className="empty-state">
                  <img src={upload} alt="upload" />
                  <div className="image-text">
                    <span className="bold">Choose a file</span>
                    <div className="tagline">or drag it here</div>
                  </div>
                </div>
              </div>
            )
          ) : desktopView}
          <canvas ref={canvasRef} className="main-canvas" />
        </div>
        <input
          ref={inputRef}
          accept="image/*"
          type="file"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default App;
