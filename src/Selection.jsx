import { useRef, useCallback } from "react";

// Grab distance for corners, in screen pixels. Fingers need a bigger target.
const HANDLE_REACH = { touch: 28, pen: 16, mouse: 10 };
const MIN_SIZE = 2; // percent

const clampRect = (r) => {
  const w = Math.min(100, Math.max(MIN_SIZE, r.w));
  const h = Math.min(100, Math.max(MIN_SIZE, r.h));
  return {
    x: Math.min(100 - w, Math.max(0, r.x)),
    y: Math.min(100 - h, Math.max(0, r.y)),
    w,
    h,
  };
};

// Resize from a corner, keeping the opposite corner fixed and the rect inside the image.
const resize = (start, mode, dx, dy) => {
  let left = start.x;
  let top = start.y;
  let right = start.x + start.w;
  let bottom = start.y + start.h;

  if (mode.includes("w")) left = Math.min(right - MIN_SIZE, Math.max(0, left + dx));
  if (mode.includes("e")) right = Math.max(left + MIN_SIZE, Math.min(100, right + dx));
  if (mode.includes("n")) top = Math.min(bottom - MIN_SIZE, Math.max(0, top + dy));
  if (mode.includes("s")) bottom = Math.max(top + MIN_SIZE, Math.min(100, bottom + dy));

  return { x: left, y: top, w: right - left, h: bottom - top };
};

const Selection = ({ rect, onChange, containerRef }) => {
  // { mode, pointerId, startPos, startRect } while a drag is in progress
  const dragRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const getRelativePos = useCallback(
    (e) => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return null;
      return {
        x: ((e.clientX - bounds.left) / bounds.width) * 100,
        y: ((e.clientY - bounds.top) / bounds.height) * 100,
        bounds,
      };
    },
    [containerRef]
  );

  const hitTest = useCallback(
    (pos, pointerType) => {
      const r = rect;
      const reach = HANDLE_REACH[pointerType] ?? HANDLE_REACH.mouse;
      const toPxX = (pct) => (pct / 100) * pos.bounds.width;
      const toPxY = (pct) => (pct / 100) * pos.bounds.height;

      const corners = [
        ["nw", r.x, r.y],
        ["ne", r.x + r.w, r.y],
        ["sw", r.x, r.y + r.h],
        ["se", r.x + r.w, r.y + r.h],
      ];

      let best = null;
      for (const [mode, cx, cy] of corners) {
        const dist = Math.hypot(toPxX(pos.x - cx), toPxY(pos.y - cy));
        if (dist <= reach && (!best || dist < best.dist)) best = { mode, dist };
      }
      if (best) return best.mode;

      const inside =
        pos.x >= r.x && pos.x <= r.x + r.w && pos.y >= r.y && pos.y <= r.y + r.h;
      return inside ? "move" : null;
    },
    [rect]
  );

  const onPointerDown = useCallback(
    (e) => {
      if (!rect || dragRef.current) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const pos = getRelativePos(e);
      if (!pos) return;

      const mode = hitTest(pos, e.pointerType);
      if (!mode) return;

      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {
        mode,
        pointerId: e.pointerId,
        startPos: pos,
        startRect: rect,
      };
    },
    [rect, getRelativePos, hitTest]
  );

  const onPointerMove = useCallback(
    (e) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;
      const pos = getRelativePos(e);
      if (!pos) return;

      const dx = pos.x - drag.startPos.x;
      const dy = pos.y - drag.startPos.y;
      const s = drag.startRect;

      const next =
        drag.mode === "move"
          ? { ...s, x: s.x + dx, y: s.y + dy }
          : resize(s, drag.mode, dx, dy);

      onChangeRef.current(clampRect(next));
    },
    [getRelativePos]
  );

  const endDrag = useCallback((e) => {
    if (dragRef.current?.pointerId === e.pointerId) dragRef.current = null;
  }, []);

  if (!rect || rect.w < 1 || rect.h < 1) return null;

  const box = {
    left: `${rect.x}%`,
    top: `${rect.y}%`,
    width: `${rect.w}%`,
    height: `${rect.h}%`,
  };

  return (
    <div
      className="selection-overlay"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Shading is clipped to the image; the rect and its handles are not */}
      <div className="selection-scrim-clip">
        <div className="selection-scrim-hole" style={box} />
      </div>
      <div className="selection-rect" style={box}>
        <div className="selection-handle nw" />
        <div className="selection-handle ne" />
        <div className="selection-handle sw" />
        <div className="selection-handle se" />
      </div>
    </div>
  );
};

export default Selection;
