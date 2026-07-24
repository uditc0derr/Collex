import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-cloud text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <div className="mx-auto flex max-w-[1440px] gap-5 px-4 py-5 lg:px-6">
        <Sidebar />
        <main className="min-w-0 flex-1 pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
