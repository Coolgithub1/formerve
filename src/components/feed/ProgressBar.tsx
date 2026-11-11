interface Props {
  /** 0-based index of the reel on screen (= number already decided). */
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  return (
    <div className="w-full">
      <div className="h-1 w-full overflow-hidden rounded bg-white/10">
        <div className="h-full rounded bg-white transition-[width] duration-300" style={{ width: `${(current / total) * 100}%` }} />
      </div>
      <p className="mt-2 text-center text-sm opacity-60">
        Reel {Math.min(current + 1, total)} of {total}
      </p>
    </div>
  );
}
