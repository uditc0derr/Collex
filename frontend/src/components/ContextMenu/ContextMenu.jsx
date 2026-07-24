import { Download, Edit3, FolderInput, Info, Star, Trash2 } from "lucide-react";

export const fileActions = [
  { key: "download", label: "Download", icon: Download },
  { key: "favorite", label: "Favorite", icon: Star },
  { key: "move", label: "Move to folder", icon: FolderInput },
  { key: "rename", label: "Rename", icon: Edit3 },
  { key: "info", label: "Information", icon: Info },
  { key: "trash", label: "Move to trash", icon: Trash2 }
];

export const folderActions = [
  { key: "favorite", label: "Favorite", icon: Star },
  { key: "move", label: "Move to folder", icon: FolderInput },
  { key: "rename", label: "Rename", icon: Edit3 },
  { key: "info", label: "Information", icon: Info },
  { key: "trash", label: "Move to trash", icon: Trash2 }
];

export const trashFileActions = [
  { key: "info", label: "Information", icon: Info },
  { key: "deletePermanent", label: "Delete permanently", icon: Trash2 }
];

export const trashFolderActions = [
  { key: "info", label: "Information", icon: Info },
  { key: "deletePermanent", label: "Delete permanently", icon: Trash2 }
];

export default function ContextMenu({ position, onAction, onClose, actions = fileActions }) {
  if (!position) return null;
  const item = position.file || position.folder;
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-soft dark:border-slate-800 dark:bg-slate-900" style={{ left: position.x, top: position.y }}>
        {actions.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => onAction(key)} className="flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
            <Icon className="h-4 w-4" />
            {key === "favorite" ? (item?.favorite ? "Remove favorite" : "Add favorite") : label}
          </button>
        ))}
      </div>
    </div>
  );
}
