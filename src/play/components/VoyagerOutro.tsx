import React from 'react';
import { ARCHIVE_DISCLAIMER } from '../missions/voyager/data';

interface VoyagerOutroProps {
  progress: number;
  onContinue: () => void;
  onMissions: () => void;
}

export const VoyagerOutro: React.FC<VoyagerOutroProps> = ({ progress, onContinue, onMissions }) => {
  const showCard = progress > 0.72;

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 pointer-events-none md:p-12 short:gap-1.5 short:p-2 short:px-[max(0.75rem,env(safe-area-inset-left),env(safe-area-inset-right))]">
      <div className="w-fit rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-2 text-xs font-mono-num text-slate-300 short:px-2.5 short:py-1 short:text-[10px]">
        MISSION 02: VOYAGER 1 · ARCHIVE SENT
      </div>

      {showCard && (
        <div className="thin-scroll pointer-events-auto mx-auto my-auto max-w-xl rounded-2xl border border-slate-700/80 bg-slate-950/95 p-6 text-center shadow-2xl md:p-8 short:min-h-0 short:max-w-[min(36rem,100%)] short:overflow-y-auto short:rounded-xl short:p-3">
          <div className="text-xs font-mono-num font-bold tracking-wider text-amber-300 short:text-[10px]">
            MARS SAMPLE RETURN
          </div>
          <h2 className="mt-3 text-2xl font-extrabold text-slate-100 md:text-3xl short:mt-1 short:text-lg">
            A neighbouring world
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 short:mt-1 short:text-xs short:leading-snug">
            Sometimes the greatest discoveries are not in the farthest dark. Sometimes they wait on a world that once had rivers and lakes, and may once have been a place where life could survive. Mars.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-slate-500 short:mt-1.5 short:text-[11px] short:leading-snug">{ARCHIVE_DISCLAIMER}</p>
          {/* Stacked on large screens; side by side on phones held sideways. */}
          <div className="mt-6 flex flex-col items-center gap-3 short:mt-2.5 short:flex-row short:justify-center short:gap-2">
          <button
            type="button"
            onClick={onContinue}
            className="rounded-lg bg-orange-400 px-5 py-3 text-sm font-bold text-slate-950 short:px-3 short:py-2 short:text-xs"
          >
            CONTINUE TO MISSION 03
          </button>
          <button
            type="button"
            onClick={onMissions}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-5 py-3 text-sm font-bold text-slate-100 short:w-auto short:px-3 short:py-2 short:text-xs"
          >
            BACK TO HOME
          </button>
          </div>
        </div>
      )}

      <div className="text-center text-xs font-mono-num text-slate-500 short:hidden">
        {progress < 0.4
          ? 'LEAVING VOYAGER 1'
          : progress < 0.72
            ? 'PALE BLUE DOT · EARTH FROM THE DEEP'
            : 'APPROACHING MARS'}
      </div>
    </div>
  );
};
