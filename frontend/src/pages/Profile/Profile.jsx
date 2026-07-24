import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/format";

export default function Profile() {
  const { user, logout } = useAuth();
  return (
    <section className="max-w-2xl">
      <h1 className="mb-5 text-2xl font-semibold">Profile</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-lg bg-slate-900 text-xl font-bold text-white dark:bg-white dark:text-slate-950">{initials(user?.name)}</div>
          <div>
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="mt-6 flex h-11 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </section>
  );
}
