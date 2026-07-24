import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export function useFolderActions(folder, { close, onRename, onMove, onInfo } = {}) {
  const queryClient = useQueryClient();

  async function refreshData() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      queryClient.invalidateQueries({ queryKey: ["files"] }),
      queryClient.invalidateQueries({ queryKey: ["folders"] }),
      queryClient.invalidateQueries({ queryKey: ["search"] }),
      queryClient.invalidateQueries({ queryKey: ["search-filter"] }),
      queryClient.invalidateQueries({ queryKey: ["trash"] })
    ]);
  }

  return async (action) => {
    if (!folder) return;

    try {
      if (action === "info") {
        onInfo?.(folder);
        close?.();
        return;
      }

      if (action === "favorite") {
        await api.patch(`/api/folders/${folder.id}`, { favorite: !folder.favorite });
        await refreshData();
        toast.success(folder.favorite ? "Removed from favorites" : "Added to favorites");
        close?.();
        return;
      }

      if (action === "trash") {
        await api.delete(`/api/folders/${folder.id}`);
        await refreshData();
        toast.success("Folder moved to trash");
        close?.();
        return;
      }

      if (action === "deletePermanent") {
        await api.delete(`/api/folders/${folder.id}/permanent`);
        await refreshData();
        toast.success("Folder deleted permanently");
        close?.();
        return;
      }

      if (action === "rename") {
        onRename?.(folder);
        close?.();
        return;
      }

      if (action === "move") {
        onMove?.(folder);
        close?.();
      }
    } catch {
      toast.error("Could not update folder");
    }
  };
}
