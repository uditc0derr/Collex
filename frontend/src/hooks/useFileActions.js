import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { downloadFile as triggerDownload } from "../utils/download";

export function useFileActions(file, { close, onRename, onMove, onInfo } = {}) {
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
    if (!file) return;

    try {
      if (action === "download") {
        await triggerDownload(file);
        close?.();
        return;
      }

      if (action === "info") {
        onInfo?.(file);
        close?.();
        return;
      }

      if (action === "favorite") {
        await api.patch(`/api/files/${file.id}`, { favorite: !file.favorite });
        await refreshData();
        toast.success(file.favorite ? "Removed from favorites" : "Added to favorites");
        close?.();
        return;
      }

      if (action === "trash") {
        await api.delete(`/api/files/${file.id}`);
        await refreshData();
        toast.success("File moved to trash");
        close?.();
        return;
      }

      if (action === "deletePermanent") {
        await api.delete(`/api/files/${file.id}/permanent`);
        await refreshData();
        toast.success("File deleted permanently");
        close?.();
        return;
      }

      if (action === "rename") {
        onRename?.(file);
        close?.();
        return;
      }

      if (action === "move") {
        onMove?.(file);
        close?.();
      }
    } catch {
      toast.error("Could not update file");
    }
  };
}
