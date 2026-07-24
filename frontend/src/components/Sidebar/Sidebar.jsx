import { Clock, HardDrive, LayoutDashboard, Settings, Star, Trash2 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, match: (location) => location.pathname === "/" },
  { to: "/drive", label: "My Drive", icon: HardDrive, match: (location) => location.pathname === "/drive" || location.pathname.startsWith("/folder/") },
  { to: "/search?filter=recent", label: "Recent", icon: Clock, match: (location) => location.pathname === "/search" && new URLSearchParams(location.search).get("filter") === "recent" },
  { to: "/search?filter=favorites", label: "Favorites", icon: Star, match: (location) => location.pathname === "/search" && new URLSearchParams(location.search).get("filter") === "favorites" },
  { to: "/trash", label: "Trash", icon: Trash2, match: (location) => location.pathname === "/trash" },
  { to: "/settings", label: "Settings", icon: Settings, match: (location) => location.pathname === "/settings" }
];

export default function Sidebar() {
  const location = useLocation();

  function itemClass(isActive) {
    return `flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
      isActive ? "bg-primary text-white shadow-soft" : "text-slate-600 hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
    }`;
  }

  return (
    <>
      <aside className="hidden w-64 shrink-0 lg:block">
        <nav className="sticky top-20 space-y-1">
          {links.map(({ to, label, icon: Icon, match }) => (
            <NavLink key={to} to={to} className={itemClass(match(location))}>
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 gap-1 border-t border-slate-200 bg-white px-2 py-2 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
        {links.slice(0, 5).map(({ to, label, icon: Icon, match }) => (
          <NavLink key={to} to={to} className={`flex h-12 flex-col items-center justify-center rounded-lg text-xs ${match(location) ? "bg-primary/10 text-primary dark:bg-primary/20" : "text-slate-600 dark:text-slate-300"}`}>
            <Icon className="mb-1 h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
