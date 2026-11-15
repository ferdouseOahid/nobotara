import React, { useEffect, useRef } from 'react';

interface ScreenPoint {
  x: number;
  y: number;
  visible: boolean;
}

interface RoverNoteProps {
  readPoint: () => ScreenPoint | undefined;
}

/** How far above the rover's deck the note sits, in pixels. */
const LIFT = 118;
const LIFT_SHORT = 58;

/**
 * A label over the Moon rover saying it is made up: Apollo 11 had no rover.
 * Shown from the moment the rover boots until the player first drives or steers.
 * Positions are written on the elements so nothing re-renders every frame.
 */
export const RoverNote: React.FC<RoverNoteProps> = ({ readPoint }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const box = boxRef.current;
      const line = lineRef.current;
      const dot = dotRef.current;
      const point = readPoint();
      if (box && line && dot) {
        if (!point?.visible) {
          box.style.visibility = 'hidden';
          line.style.opacity = '0';
          dot.style.opacity = '0';
        } else {
          const short = window.innerHeight < 500;
          const clearTop = short ? 52 : 96;
          const halfW = box.offsetWidth / 2 || 110;
          const halfH = box.offsetHeight / 2 || 24;
          const x = Math.min(window.innerWidth - halfW - 8, Math.max(halfW + 8, point.x));
          const y = Math.max(clearTop + halfH, point.y - (short ? LIFT_SHORT : LIFT));
          box.style.left = `${x}px`;
          box.style.top = `${y}px`;
          box.style.visibility = 'visible';
          const rect = box.getBoundingClientRect();
          line.setAttribute('x1', String(rect.left + rect.width / 2));
          line.setAttribute('y1', String(rect.bottom));
          line.setAttribute('x2', String(point.x));
          line.setAttribute('y2', String(point.y));
          dot.setAttribute('cx', String(point.x));
          dot.setAttribute('cy', String(point.y));
          const below = rect.bottom < point.y - 6;
          line.style.opacity = below ? '1' : '0';
          dot.style.opacity = below ? '1' : '0';
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [readPoint]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[21]" aria-live="polite">
      <svg className="h-full w-full" aria-hidden="true">
        <line ref={lineRef} stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0 }} />
        <circle ref={dotRef} r="4.5" fill="#f8fafc" style={{ opacity: 0 }} />
      </svg>
      <div
        ref={boxRef}
        style={{ visibility: 'hidden' }}
        className="fixed z-20 w-max max-w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-md border border-white/85 bg-slate-950/90 px-3 py-1.5 text-center shadow-lg short:max-w-[12rem] short:px-2 short:py-1"
      >
        <div className="text-sm font-semibold text-white short:text-[11px]">Imaginary rover</div>
        <div className="text-xs leading-snug text-slate-300 short:text-[10px]">
          Apollo 11 had no rover. We made this one up for exploring.
        </div>
      </div>
    </div>
  );
};
