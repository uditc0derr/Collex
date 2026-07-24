import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import ContextMenu, { folderActions } from "../../components/ContextMenu/ContextMenu";
import EmptyState from "../../components/EmptyState/EmptyState";
import FileCard from "../../components/FileCard/FileCard";
import FolderCard from "../../components/FolderCard/FolderCard";
import InfoModal from "../../components/InfoModal/InfoModal";
import MoveFileModal from "../../components/MoveFileModal/MoveFileModal";
import MoveFolderModal from "../../components/MoveFolderModal/MoveFolderModal";
import RenameFileModal from "../../components/RenameFileModal/RenameFileModal";
import RenameFolderModal from "../../components/RenameFolderModal/RenameFolderModal";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useFileActions } from "../../hooks/useFileActions";
import { useFolderActions } from "../../hooks/useFolderActions";
import { api } from "../../services/api";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const filter = params.get("filter") || "";
  const [menu, setMenu] = useState(null);
  const [renameFile, setRenameFile] = useState(null);
  const [moveFile, setMoveFile] = useState(null);
  const [renameFolder, setRenameFolder] = useState(null);
  const [moveFolder, setMoveFolder] = useState(null);
  const [infoItem, setInfoItem] = useState(null);
  const queryClient = useQueryClient();
  const q = params.get("q") || "";
  const sortBy = params.get("sortBy") || (filter === "recent" ? "createdAt" : "updatedAt");
  const sortOrder = params.get("sortOrder") || "desc";
  const fileActionsHandler = useFileActions(menu?.file, {
    close: () => setMenu(null),
    onRename: (file) => setRenameFile(file),
    onMove: (file) => setMoveFile(file),
    onInfo: (file) => setInfoItem({ type: "file", item: file })
  });
  const folderActionsHandler = useFolderActions(menu?.folder, {
    close: () => setMenu(null),
    onRename: (folder) => setRenameFolder(folder),
    onMove: (folder) => setMoveFolder(folder),
    onInfo: (folder) => setInfoItem({ type: "folder", item: folder })
  });
  const handleMenuAction = menu?.folder ? folderActionsHandler : fileActionsHandler;
  const renameMutation = useMutation({
    mutationFn: async (name) => api.patch(`/api/files/${renameFile.id}`, { name }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["files"] }),
        queryClient.invalidateQueries({ queryKey: ["search"] }),
        queryClient.invalidateQueries({ queryKey: ["search-filter"] })
      ]);
      toast.success("File renamed");
      setRenameFile(null);
    },
    onError: () => toast.error("Could not rename file")
  });
  const renameFolderMutation = useMutation({
    mutationFn: async (name) => api.patch(`/api/folders/${renameFolder.id}`, { name }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["folders"] }),
        queryClient.invalidateQueries({ queryKey: ["search"] }),
        queryClient.invalidateQueries({ queryKey: ["search-filter"] })
      ]);
      toast.success("Folder renamed");
      setRenameFolder(null);
    },
    onError: () => toast.error("Could not rename folder")
  });
  const searchQuery = useQuery({
    queryKey: ["search", q],
    queryFn: async () => (await api.get("/api/search", { params: { q } })).data,
    enabled: q.length > 0
  });
  const filteredFilesQuery = useQuery({
    queryKey: ["search-filter", "files", filter, sortBy, sortOrder],
    queryFn: async () =>
      (
        await api.get("/api/files", {
          params: {
            status: "ACTIVE",
            favorite: filter === "favorites" ? "true" : undefined,
            sortBy,
            sortOrder,
            limit: 30
          }
        })
      ).data,
    enabled: q.length === 0 && (filter === "favorites" || filter === "recent")
  });
  const filteredFoldersQuery = useQuery({
    queryKey: ["search-filter", "folders", filter, sortBy, sortOrder],
    queryFn: async () =>
      (
        await api.get("/api/folders", {
          params: {
            flat: true,
            favorite: "true",
            sortBy,
            sortOrder
          }
        })
      ).data,
    enabled: q.length === 0 && filter === "favorites"
  });

  const files = q.length > 0 ? searchQuery.data?.files || [] : filteredFilesQuery.data || [];
  const folders = q.length > 0 ? searchQuery.data?.folders || [] : filter === "favorites" ? filteredFoldersQuery.data || [] : [];
  const title = q ? "Search" : filter === "favorites" ? "Favorites" : filter === "recent" ? "Recent uploads" : "Search";
  const emptyTitle = q ? "No matches" : filter === "favorites" ? "No favorites yet" : filter === "recent" ? "No recent uploads" : "No results";

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">{title}</h1>
      <SearchBar
        defaultValue={q}
        placeholder="Search metadata"
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          const next = new URLSearchParams(params);
          const value = event.currentTarget.value.trim();
          if (value) next.set("q", value);
          else next.delete("q");
          setParams(next);
        }}
      />
      {q.length === 0 && filter !== "" ? (
        <div className="mt-4 flex items-center gap-2">
          <label className="text-sm text-slate-500">Sort</label>
          <select
            value={sortBy}
            onChange={(event) => {
              const next = new URLSearchParams(params);
              next.set("sortBy", event.target.value);
              setParams(next);
            }}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <option value="updatedAt">Last modified</option>
            <option value="createdAt">Upload date</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
          </select>
          <select
            value={sortOrder}
            onChange={(event) => {
              const next = new URLSearchParams(params);
              next.set("sortOrder", event.target.value);
              setParams(next);
            }}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      ) : null}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {folders.map((folder) => <FolderCard key={folder.id} folder={folder} onMenu={(event, selected) => setMenu({ x: event.clientX, y: event.clientY, folder: selected })} />)}
        {files.map((file) => <FileCard key={file.id} file={file} onMenu={(event, selected) => setMenu({ x: event.clientX, y: event.clientY, file: selected })} />)}
      </div>
      {!folders.length && !files.length ? (
        <div className="mt-6">
          <EmptyState title={emptyTitle} subtitle="Search runs against your Collex metadata for fast results." />
        </div>
      ) : null}
      <ContextMenu position={menu} onClose={() => setMenu(null)} onAction={handleMenuAction} actions={menu?.folder ? folderActions : undefined} />
      <RenameFileModal
        open={Boolean(renameFile)}
        file={renameFile}
        isPending={renameMutation.isPending}
        onClose={() => setRenameFile(null)}
        onSubmit={(name) => renameMutation.mutate(name)}
      />
      <RenameFolderModal
        open={Boolean(renameFolder)}
        folder={renameFolder}
        isPending={renameFolderMutation.isPending}
        onClose={() => setRenameFolder(null)}
        onSubmit={(name) => renameFolderMutation.mutate(name)}
      />
      <MoveFileModal open={Boolean(moveFile)} file={moveFile} onClose={() => setMoveFile(null)} />
      <MoveFolderModal open={Boolean(moveFolder)} folder={moveFolder} onClose={() => setMoveFolder(null)} />
      <InfoModal open={Boolean(infoItem)} item={infoItem?.item} type={infoItem?.type} onClose={() => setInfoItem(null)} />
    </section>
  );
}
