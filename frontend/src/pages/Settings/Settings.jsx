import { useQuery } from "@tanstack/react-query";
import { Plug, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import { bytes } from "../../utils/format";

export default function Settings() {
  const { data = [] } = useQuery({ queryKey: ["google-accounts"], queryFn: async () => (await api.get("/api/google")).data });
  async function connectGoogle() {
    try {
      const { data } = await api.get("/api/google/connect", { params: { mode: "json" } });
      window.location.href = data.url;
    } catch {
      toast.error("Could not start Google OAuth");
    }
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Manage Google accounts and storage routing.</p>
        </div>
        <button onClick={connectGoogle} className="flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-soft">
          <Plug className="h-4 w-4" />
          Connect Google
        </button>
      </div>
      <div className="space-y-3">
        {data.map((account) => (
          <div key={account.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div>
              <p className="font-semibold">{account.email}</p>
              <p className="text-sm text-slate-500">{bytes(account.quota - account.usedStorage)} free</p>
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-lg text-danger hover:bg-red-50 dark:hover:bg-red-950/30" title="Disconnect">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
