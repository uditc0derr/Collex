import { Bell, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/format";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));

  function toggleDark() {
    document.documentElement.classList.toggle("dark");
    setDark(document.documentElement.classList.contains("dark"));
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 lg:px-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-lg font-black text-white">C</span>
          <span className="hidden text-lg font-semibold sm:block">Collex</span>
        </button>
        <form
          className="relative flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            const q = new FormData(event.currentTarget).get("q");
            if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            placeholder="Search files and folders"
            className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:focus:bg-slate-900"
          />
        </form>
        <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" title="Notifications">
          <Bell className="h-4 w-4" />
        </button>
        <button onClick={toggleDark} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" title="Toggle dark mode">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button onClick={() => navigate("/profile")} className="grid h-10 w-10 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
          {initials(user?.name)}
        </button>
      </div>
    </header>
  );
}
