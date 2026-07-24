import { Dialog } from "@headlessui/react";

export default function ConfirmModal({ open, title, body, onConfirm, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/40" />
      <div className="fixed inset-0 grid place-items-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-lg bg-white p-5 shadow-soft dark:bg-slate-900">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <p className="mt-2 text-sm text-slate-500">{body}</p>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={onClose} className="h-10 rounded-lg px-4 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
            <button onClick={onConfirm} className="h-10 rounded-lg bg-danger px-4 text-sm font-semibold text-white">Confirm</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
