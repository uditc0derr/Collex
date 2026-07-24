import { Dialog } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadCloud, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { api } from "../../services/api";

export default function UploadModal({ open, onClose, folderId }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (files) => {
      const formData = new FormData();
      if (folderId) formData.append("folderId", folderId);
      files.forEach((file) => formData.append("files", file));
      return api.post("/api/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
    },
    onSuccess: async ({ data }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["files"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["search"] })
      ]);
      const firstAccount = data?.files?.[0]?.googleAccount?.email;
      const suffix = firstAccount ? ` to ${firstAccount}` : "";
      toast.success(`Upload complete${suffix}`);
      onClose();
    },
    onError: () => toast.error("Upload failed")
  });

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ multiple: true });

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" />
      <div className="fixed inset-0 grid place-items-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">Upload files</Dialog.Title>
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div {...getRootProps()} className={`grid min-h-52 cursor-pointer place-items-center rounded-lg border-2 border-dashed p-8 text-center ${isDragActive ? "border-primary bg-blue-50 dark:bg-blue-950/30" : "border-slate-200 dark:border-slate-700"}`}>
            <input {...getInputProps()} />
            <div>
              <UploadCloud className="mx-auto mb-3 h-10 w-10 text-primary" />
              <p className="font-medium">Drop files here or click to browse</p>
              <p className="mt-1 text-sm text-slate-500">Streams directly through Collex to Google Drive</p>
            </div>
          </div>
          {acceptedFiles.length > 0 && <p className="mt-3 text-sm text-slate-500">{acceptedFiles.length} file(s) selected</p>}
          <button disabled={!acceptedFiles.length || mutation.isPending} onClick={() => mutation.mutate(acceptedFiles)} className="mt-5 h-11 w-full rounded-lg bg-primary font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
            {mutation.isPending ? "Uploading..." : "Start upload"}
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
