import { useState, useRef } from "react";
import leftImg from "../../../images/hrt1.png";
import rightImg from "../../../images/htr2.png";

export function DraggableItem({ item, section, index, onDragStart, onTouchDrop }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isTouchDrag, setIsTouchDrag] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });
  const elRef = useRef<HTMLDivElement>(null);

  // Desktop: HTML5 drag-and-drop
  const handleDragStart = () => {
    setIsDragging(true);
    onDragStart(section, index);
  };
  const handleDragEnd = () => setIsDragging(false);

  // Mobile: Pointer events (touch/pen only — mouse is handled above via drag events)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    initialPos.current = { x: e.clientX, y: e.clientY };
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(true);
    setIsTouchDrag(true);
    onDragStart(section, index);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" || !isTouchDrag) return;
    setDragOffset({
      x: e.clientX - initialPos.current.x,
      y: e.clientY - initialPos.current.y,
    });
  };

  const finishTouchDrop = (clientX: number, clientY: number) => {
    setIsDragging(false);
    setIsTouchDrag(false);
    setDragOffset({ x: 0, y: 0 });

    const el = elRef.current;
    if (!el) { onTouchDrop(null); return; }

    // Temporarily hide the dragged element so elementFromPoint finds what's beneath
    el.style.visibility = "hidden";
    el.style.pointerEvents = "none";
    const target = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    el.style.visibility = "";
    el.style.pointerEvents = "";

    const dropTarget = target?.closest("[data-section]") as HTMLElement | null;
    onTouchDrop(dropTarget?.dataset?.section ?? null);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" || !isTouchDrag) return;
    finishTouchDrop(e.clientX, e.clientY);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    setIsDragging(false);
    setIsTouchDrag(false);
    setDragOffset({ x: 0, y: 0 });
    onTouchDrop(null);
  };

  const translateStyle = isTouchDrag
    ? `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(1.12) rotate(2deg)`
    : isDragging
    ? "scale(1.1) rotate(2deg)"
    : undefined;

  return (
    <div
      ref={elRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={`w-14 sm:w-20 lg:w-[7.5rem] h-28 sm:h-40 lg:h-[15rem] my-2 sm:my-4 lg:my-6 mx-auto select-none transition-all duration-200 ${
        isDragging ? "cursor-grabbing opacity-90" : "cursor-grab"
      }`}
      style={{
        filter: isDragging
          ? "drop-shadow(0 0.5rem 1.25rem rgba(255, 105, 180, 0.4))"
          : "drop-shadow(0 0.25rem 0.75rem rgba(255, 105, 180, 0.2))",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        touchAction: "none",
        transform: translateStyle,
        zIndex: isDragging ? 50 : undefined,
        position: isDragging ? "relative" : undefined,
        willChange: isTouchDrag ? "transform" : undefined,
      }}
    >
      <img
        src={item.side === "left" ? leftImg : rightImg}
        alt={`heart-${item.side}`}
        className="w-full h-full block object-contain pointer-events-none"
        draggable={false}
      />
    </div>
  );
}

export function PairedItem() {
  return (
    <div
      className="flex gap-0 my-2 sm:my-4 lg:my-6 mx-auto w-28 sm:w-48 lg:w-[15rem] h-28 sm:h-48 lg:h-[15rem] relative z-10 before:content-[''] before:absolute before:-inset-2 sm:before:-inset-4 lg:before:-inset-6 before:rounded-full before:pointer-events-none"
      style={{
        background:
          "radial-gradient(circle, rgba(255, 105, 180, 0.3) 0%, transparent 70%)",
      }}
    >
      <div className="w-14 sm:w-24 lg:w-[7.5rem] h-28 sm:h-48 lg:h-[15rem]">
        <img
          src={leftImg}
          alt="left-heart"
          draggable={false}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="w-14 sm:w-24 lg:w-[7.5rem] h-28 sm:h-48 lg:h-[15rem]">
        <img
          src={rightImg}
          alt="right-heart"
          draggable={false}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
