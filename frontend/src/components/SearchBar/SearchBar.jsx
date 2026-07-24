import { Search } from "lucide-react";

export default function SearchBar(props) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input {...props} className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-primary dark:border-slate-800 dark:bg-slate-900" />
    </div>
  );
}
