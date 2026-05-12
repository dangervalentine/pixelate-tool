import { useState, useRef, useCallback, useEffect } from "react";

const Selection = ({ rect, onChange, containerRef }) => {
  const [dragging, setDragging] = useState(null);
  const startRef = useRef(null);
  const rectRef = useRef(rect);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    rectRef.current = rect;
  }, [rect]);

  const getRelativePos = useCallback(
    (e) => {
      const el = containerRef.current;
      if (!el) return { x: 0, y: 0 };
      const bounds = el.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: ((clientX - bounds.left) / bounds.width) * 100,
        y: ((clientY - bounds.top) / bounds.height) * 100,
      };
    },
    [containerRef]
  );

  const onPointerDown = useCallback(
    (e) => {
      if (!rectRef.current) return;
      e.preventDefault();
      const pos = getRelativePos(e);
      const r = rectRef.current;

      const nearLeft = Math.abs(pos.x - r.x) < 5;
      const nearRight = Math.abs(pos.x - (r.x + r.w)) < 5;
      const nearTop = Math.abs(pos.y - r.y) < 5;
      const nearBottom = Math.abs(pos.y - (r.y + r.h)) < 5;

      if (nearTop && nearLeft) { setDragging("nw"); startRef.current = pos; return; }
      if (nearTop && nearRight) { setDragging("ne"); startRef.current = pos; return; }
      if (nearBottom && nearLeft) { setDragging("sw"); startRef.current = pos; return; }
      if (nearBottom && nearRight) { setDragging("se"); startRef.current = pos; return; }

      const inX = pos.x >= r.x && pos.x <= r.x + r.w;
      const inY = pos.y >= r.y && pos.y <= r.y + r.h;

      if (inX && inY) { setDragging("move"); startRef.current = pos; return; }
    },
    [getRelativePos]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!startRef.current || !dragging || !rectRef.current) return;
      e.preventDefault();
      const pos = getRelativePos(e);
      const dx = pos.x - startRef.current.x;
      const dy = pos.y - startRef.current.y;
      const r = { ...rectRef.current };

      switch (dragging) {
        case "move":
          r.x = Math.max(0, Math.min(100 - r.w, r.x + dx));
          r.y = Math.max(0, Math.min(100 - r.h, r.y + dy));
          break;
        case "nw": r.x += dx; r.y += dy; r.w -= dx; r.h -= dy; break;
        case "ne": r.y += dy; r.w += dx; r.h -= dy; break;
        case "sw": r.x += dx; r.w -= dx; r.h += dy; break;
        case "se": r.w += dx; r.h += dy; break;
      }

      if (r.w < 2) r.w = 2;
      if (r.h < 2) r.h = 2;

      onChangeRef.current(r);
      startRef.current = pos;
    },
    [dragging, getRelativePos]
  );

  const onPointerUp = useCallback(() => {
    setDragging(null);
    startRef.current = null;
  }, []);

  useEffect(() => {
    const handler = () => {
      if (dragging) onPointerUp();
    };
    window.addEventListener("mouseup", handler);
    window.addEventListener("touchend", handler);
    return () => {
      window.removeEventListener("mouseup", handler);
      window.removeEventListener("touchend", handler);
    };
  }, [dragging, onPointerUp]);

  if (!rect || rect.w < 1 || rect.h < 1) return null;

  return (
    <div
      className="selection-overlay"
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="selection-rect"
        style={{
          left: `${rect.x}%`,
          top: `${rect.y}%`,
          width: `${rect.w}%`,
          height: `${rect.h}%`,
          background: "transparent",
          boxShadow: `0 0 0 9999px var(--color-bg-scrim)`,
          pointerEvents: "auto",
          cursor: "move",
        }}
      >
        <div className="selection-handle nw" />
        <div className="selection-handle ne" />
        <div className="selection-handle sw" />
        <div className="selection-handle se" />
      </div>
    </div>
  );
};

export default Selection;
