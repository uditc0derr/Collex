import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Upload } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import StorageBar from "../../components/StorageBar/StorageBar";
import UploadModal from "../../components/UploadModal/UploadModal";
import FileCard from "../../components/FileCard/FileCard";
import FolderCard from "../../components/FolderCard/FolderCard";
import Loader from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";
import ContextMenu, { folderActions } from "../../components/ContextMenu/ContextMenu";
import { useFileActions } from "../../hooks/useFileActions";
import { useFolderActions } from "../../hooks/useFolderActions";
import CreateFolderModal from "../../components/CreateFolderModal/CreateFolderModal";
import RenameFileModal from "../../components/RenameFileModal/RenameFileModal";
import RenameFolderModal from "../../components/RenameFolderModal/RenameFolderModal";
import MoveFileModal from "../../components/MoveFileModal/MoveFileModal";
import MoveFolderModal from "../../components/MoveFolderModal/MoveFolderModal";
import InfoModal from "../../components/InfoModal/InfoModal";

export default function Dashboard() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [menu, setMenu] = useState(null);
  const [renameFile, setRenameFile] = useState(null);
  const [moveFile, setMoveFile] = useState(null);
  const [renameFolder, setRenameFolder] = useState(null);
  const [moveFolder, setMoveFolder] = useState(null);
  const [infoItem, setInfoItem] = useState(null);
  const queryClient = useQueryClient();
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
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: async () => (await api.get("/api/dashboard")).data });
  const { data: folders = [] } = useQuery({ queryKey: ["folders", null], queryFn: async () => (await api.get("/api/folders")).data });

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">One dashboard for every connected Google Drive.</p>
        </div>
        <div className="flex gap-2">
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
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_340px]">
        <StorageBar used={data?.storage?.used} total={data?.storage?.total} />
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold">Connected accounts</p>
          <p className="mt-2 text-3xl font-semibold">{data?.storage?.accounts?.length || 0}</p>
        </div>
      </div>
      <Content title="Folders">
        {folders.length ? folders.map((folder) => <FolderCard key={folder.id} folder={folder} onMenu={(event, selected) => setMenu({ x: event.clientX, y: event.clientY, folder: selected })} />) : <EmptyState title="No folders yet" />}
      </Content>
      <Content title="Recent uploads">
        {isLoading ? <Loader /> : data?.recentFiles?.length ? data.recentFiles.map((file) => <FileCard key={file.id} file={file} onMenu={(event, selected) => setMenu({ x: event.clientX, y: event.clientY, file: selected })} />) : <EmptyState />}
      </Content>
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <ContextMenu position={menu} onClose={() => setMenu(null)} onAction={handleMenuAction} actions={menu?.folder ? folderActions : undefined} />
      <CreateFolderModal open={folderOpen} onClose={() => setFolderOpen(false)} />
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

function Content({ title, children }) {
  return (
    <div className="mb-7">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>
    </div>
  );
}
