import { Download, File, FileImage, FileText, MoreVertical, Star } from "lucide-react";
import { bytes } from "../../utils/format";

function Icon({ mime }) {
  if (mime?.includes("image")) return FileImage;
  if (mime?.includes("pdf") || mime?.includes("text")) return FileText;
  return File;
}

export default function FileCard({ file, onMenu }) {
  const FileIcon = Icon(file.mime);
  return (
    <article className="group rounded-lg border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-primary dark:bg-blue-950/40">
          <FileIcon className="h-5 w-5" />
        </div>
        {onMenu ? (
          <button onClick={(event) => onMenu(event, file)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white" title="File actions">
            <MoreVertical className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <h3 className="truncate text-sm font-semibold">{file.name}</h3>
      {file.googleAccount?.email ? <p className="mt-1 truncate text-xs text-slate-500">Drive: {file.googleAccount.email}</p> : null}
      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>{bytes(file.size)}</span>
        <span className="flex items-center gap-2">
          {file.favorite && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
          <Download className="h-3.5 w-3.5" />
        </span>
      </div>
    </article>
  );
}
