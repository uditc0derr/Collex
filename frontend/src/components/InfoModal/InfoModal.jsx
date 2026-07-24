import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { bytes, dateTime } from "../../utils/format";

export default function InfoModal({ open, item, type, onClose }) {
  const isFile = type === "file";
  const title = isFile ? "File information" : "Folder information";

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" />
      <div className="fixed inset-0 grid place-items-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-medium text-slate-500">Name</dt>
              <dd className="mt-1 font-medium">{item?.name || "—"}</dd>
            </div>
            {isFile ? (
              <div>
                <dt className="font-medium text-slate-500">Size</dt>
                <dd className="mt-1">{bytes(item?.size)}</dd>
              </div>
            ) : null}
            <div>
              <dt className="font-medium text-slate-500">Created</dt>
              <dd className="mt-1">{dateTime(item?.createdAt)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Last modified</dt>
              <dd className="mt-1">{dateTime(item?.updatedAt)}</dd>
            </div>
          </dl>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
