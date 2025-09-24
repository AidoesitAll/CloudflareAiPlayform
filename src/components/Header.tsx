import { NavLink } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
export function Header() {
  const activeLinkClass = "text-navy";
  const inactiveLinkClass = "text-navy/60 hover:text-navy";
  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 group">
          <Sparkles className="w-7 h-7 text-magenta transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-display text-2xl font-bold text-navy">
            CanvasSpark AI
          </span>
        </NavLink>
        <div className="flex items-center gap-8 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "transition-colors duration-300",
                isActive ? activeLinkClass : inactiveLinkClass
              )
            }
          >
            Generator
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              cn(
                "transition-colors duration-300",
                isActive ? activeLinkClass : inactiveLinkClass
              )
            }
          >
            Gallery
          </NavLink>
        </div>
      </nav>
    </header>
  );
}