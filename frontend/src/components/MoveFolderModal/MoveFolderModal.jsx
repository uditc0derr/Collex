import { Dialog } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../services/api";

export default function MoveFolderModal({ open, folder, onClose }) {
  const [parentId, setParentId] = useState("");
  const queryClient = useQueryClient();
  const { data: folders = [] } = useQuery({
    queryKey: ["folders", "all"],
    queryFn: async () => (await api.get("/api/folders", { params: { flat: true } })).data,
    enabled: open
  });

  useEffect(() => {
    setParentId(folder?.parentId || "");
  }, [folder]);

  const mutation = useMutation({
    mutationFn: async (targetParentId) =>
      api.patch(`/api/folders/${folder.id}`, { parentId: targetParentId || null }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["files"] }),
        queryClient.invalidateQueries({ queryKey: ["folders"] }),
        queryClient.invalidateQueries({ queryKey: ["search"] })
      ]);
      toast.success("Folder moved");
      onClose();
    },
    onError: () => toast.error("Could not move folder")
  });

  function handleSubmit(event) {
    event.preventDefault();
    mutation.mutate(parentId);
  }

  function handleClose() {
    if (!mutation.isPending) onClose();
  }

  const destinations = folders.filter((candidate) => candidate.id !== folder?.id);

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" />
      <div className="fixed inset-0 grid place-items-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">Move folder</Dialog.Title>
            <button onClick={handleClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300" htmlFor="folder-destination">
              Destination
            </label>
            <select
              id="folder-destination"
              value={parentId}
              onChange={(event) => setParentId(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="">Root (My Drive)</option>
              {destinations.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="mt-5 h-11 w-full rounded-lg bg-primary font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending ? "Moving..." : "Move"}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
