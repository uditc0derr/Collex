import { Folder, MoreVertical, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FolderCard({ folder, onMenu }) {
  const navigate = useNavigate();
  return (
    <article onDoubleClick={() => navigate(`/folder/${folder.id}`)} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-50 text-success dark:bg-emerald-950/40">
          <Folder className="h-5 w-5 fill-current" />
        </div>
        {onMenu ? (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onMenu(event, folder);
            }}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            title="Folder actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <h3 className="truncate text-sm font-semibold">{folder.name}</h3>
      <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
        Folder
        {folder.favorite ? <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> : null}
      </p>
    </article>
  );
}
