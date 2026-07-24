import { bytes } from "../../utils/format";

export default function StorageBar({ used = 0, total = 1 }) {
  const percent = Math.min(100, Math.round((Number(used) / Math.max(Number(total), 1)) * 100));
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-semibold">Storage</span>
        <span className="text-slate-500">{bytes(used)} / {bytes(total)}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
