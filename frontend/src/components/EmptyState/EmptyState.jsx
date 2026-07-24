import { FolderOpen } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", subtitle = "Upload files or create folders to get organized." }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-slate-300 bg-white/60 p-8 text-center dark:border-slate-700 dark:bg-slate-900/50">
      <div>
        <FolderOpen className="mx-auto mb-3 h-10 w-10 text-slate-400" />
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}
