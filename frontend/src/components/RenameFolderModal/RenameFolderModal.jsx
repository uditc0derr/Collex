import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function RenameFolderModal({ open, folder, isPending, onClose, onSubmit }) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(folder?.name || "");
  }, [folder]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" />
      <div className="fixed inset-0 grid place-items-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">Rename folder</Dialog.Title>
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300" htmlFor="folder-rename">
              Folder name
            </label>
            <input
              id="folder-rename"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900"
              placeholder="Enter folder name"
            />
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="mt-5 h-11 w-full rounded-lg bg-primary font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Renaming..." : "Rename"}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
