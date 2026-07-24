import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ContextMenu, { trashFileActions, trashFolderActions } from "../../components/ContextMenu/ContextMenu";
import EmptyState from "../../components/EmptyState/EmptyState";
import FileCard from "../../components/FileCard/FileCard";
import FolderCard from "../../components/FolderCard/FolderCard";
import InfoModal from "../../components/InfoModal/InfoModal";
import Loader from "../../components/Loader/Loader";
import { useFileActions } from "../../hooks/useFileActions";
import { useFolderActions } from "../../hooks/useFolderActions";
import { api } from "../../services/api";

export default function Trash() {
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [menu, setMenu] = useState(null);
  const [infoItem, setInfoItem] = useState(null);
  const fileActions = useFileActions(menu?.file, {
    close: () => setMenu(null),
    onInfo: (file) => setInfoItem({ type: "file", item: file })
  });
  const folderActions = useFolderActions(menu?.folder, {
    close: () => setMenu(null),
    onInfo: (folder) => setInfoItem({ type: "folder", item: folder })
  });
  const handleMenuAction = menu?.folder ? folderActions : fileActions;
  const { data: files = [], isLoading: filesLoading } = useQuery({
    queryKey: ["trash", "files", sortBy, sortOrder],
    queryFn: async () => (await api.get("/api/files", { params: { status: "TRASHED", sortBy, sortOrder } })).data
  });
  const { data: folders = [], isLoading: foldersLoading } = useQuery({
    queryKey: ["trash", "folders", sortBy, sortOrder],
    queryFn: async () => (await api.get("/api/folders", { params: { status: "TRASHED", flat: true, sortBy, sortOrder } })).data
  });
  const isLoading = filesLoading || foldersLoading;
  const hasItems = files.length > 0 || folders.length > 0;

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Trash</h1>
        <div className="flex items-center gap-2">
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900">
            <option value="updatedAt">Last modified</option>
            <option value="createdAt">Date created</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
          </select>
          <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : hasItems ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {folders.map((folder) => (
            <FolderCard key={folder.id} folder={folder} onMenu={(event, selected) => setMenu({ x: event.clientX, y: event.clientY, folder: selected })} />
          ))}
          {files.map((file) => (
            <FileCard key={file.id} file={file} onMenu={(event, selected) => setMenu({ x: event.clientX, y: event.clientY, file: selected })} />
          ))}
        </div>
      ) : (
        <EmptyState title="Trash is empty" subtitle="Deleted files and folders will appear here before permanent removal." />
      )}
      <ContextMenu
        position={menu}
        onClose={() => setMenu(null)}
        onAction={handleMenuAction}
        actions={menu?.folder ? trashFolderActions : trashFileActions}
      />
      <InfoModal open={Boolean(infoItem)} item={infoItem?.item} type={infoItem?.type} onClose={() => setInfoItem(null)} />
    </section>
  );
}
