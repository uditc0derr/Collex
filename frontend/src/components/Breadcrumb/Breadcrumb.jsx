import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ items = [] }) {
  return (
    <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
      <Link to="/drive" className="flex items-center gap-1 hover:text-primary">
        <Home className="h-4 w-4" />
        My Drive
      </Link>
      {items.map((item) => (
        <span key={item.id} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          <span>{item.name}</span>
        </span>
      ))}
    </div>
  );
}
