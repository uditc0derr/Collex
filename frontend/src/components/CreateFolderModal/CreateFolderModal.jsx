import { Dialog } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../services/api";

export default function CreateFolderModal({ open, parentId = null, onClose }) {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (folderName) =>
      api.post("/api/folders", { name: folderName, parentId }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["folders"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      ]);
      toast.success("Folder created");
      setName("");
      onClose();
    },
    onError: () => toast.error("Could not create folder")
  });

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    mutation.mutate(trimmed);
  }

  function handleClose() {
    if (!mutation.isPending) {
      setName("");
      onClose();
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" />
      <div className="fixed inset-0 grid place-items-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">Create folder</Dialog.Title>
            <button onClick={handleClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300" htmlFor="folder-name">
              Folder name
            </label>
            <input
              id="folder-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900"
              placeholder="Enter folder name"
            />
            <button
              type="submit"
              disabled={mutation.isPending || !name.trim()}
              className="mt-5 h-11 w-full rounded-lg bg-primary font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending ? "Creating..." : "Create folder"}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
