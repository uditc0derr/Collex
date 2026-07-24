import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Upload } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import ContextMenu, { folderActions } from "../../components/ContextMenu/ContextMenu";
import CreateFolderModal from "../../components/CreateFolderModal/CreateFolderModal";
import EmptyState from "../../components/EmptyState/EmptyState";
import FileCard from "../../components/FileCard/FileCard";
import FolderCard from "../../components/FolderCard/FolderCard";
import Loader from "../../components/Loader/Loader";
import MoveFileModal from "../../components/MoveFileModal/MoveFileModal";
import MoveFolderModal from "../../components/MoveFolderModal/MoveFolderModal";
import RenameFileModal from "../../components/RenameFileModal/RenameFileModal";
import RenameFolderModal from "../../components/RenameFolderModal/RenameFolderModal";
import UploadModal from "../../components/UploadModal/UploadModal";
import InfoModal from "../../components/InfoModal/InfoModal";
import { useFileActions } from "../../hooks/useFileActions";
import { useFolderActions } from "../../hooks/useFolderActions";
import { api } from "../../services/api";

export default function Folder() {
  const { id } = useParams();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [menu, setMenu] = useState(null);
  const [renameFile, setRenameFile] = useState(null);
  const [moveFile, setMoveFile] = useState(null);
  const [renameFolder, setRenameFolder] = useState(null);
  const [moveFolder, setMoveFolder] = useState(null);
  const [infoItem, setInfoItem] = useState(null);
  const queryClient = useQueryClient();
  const folderId = id || null;
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
        queryClient.invalidateQueries({ queryKey: ["search"] })
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
        queryClient.invalidateQueries({ queryKey: ["search"] })
      ]);
      toast.success("Folder renamed");
      setRenameFolder(null);
    },
    onError: () => toast.error("Could not rename folder")
  });
  const { data: files = [], isLoading } = useQuery({
    queryKey: ["files", folderId, sortBy, sortOrder],
    queryFn: async () => (await api.get("/api/files", { params: { folderId, sortBy, sortOrder } })).data
  });
  const { data: folders = [] } = useQuery({ queryKey: ["folders", folderId], queryFn: async () => (await api.get("/api/folders", { params: { parentId: folderId } })).data });

  return (
    <section>
      <Breadcrumb />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">My Drive</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900">
            <option value="updatedAt">Last modified</option>
            <option value="createdAt">Upload date</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
          </select>
          <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
          <button onClick={() => setFolderOpen(true)} className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <Plus className="h-4 w-4" />
            Folder
          </button>
          <button onClick={() => setUploadOpen(true)} className="flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-soft">
            <Upload className="h-4 w-4" />
            Upload
          </button>
        </div>
      </div>
      {isLoading ? <Loader /> : folders.length || files.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {folders.map((folder) => <FolderCard key={folder.id} folder={folder} onMenu={(event, selected) => setMenu({ x: event.clientX, y: event.clientY, folder: selected })} />)}
          {files.map((file) => <FileCard key={file.id} file={file} onMenu={(event, selected) => setMenu({ x: event.clientX, y: event.clientY, file: selected })} />)}
        </div>
      ) : <EmptyState />}
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} folderId={folderId} />
      <ContextMenu position={menu} onClose={() => setMenu(null)} onAction={handleMenuAction} actions={menu?.folder ? folderActions : undefined} />
      <CreateFolderModal open={folderOpen} parentId={folderId} onClose={() => setFolderOpen(false)} />
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
