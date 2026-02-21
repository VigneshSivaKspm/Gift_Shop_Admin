import React from "react";
import { Bell, Search, User } from "lucide-react";
import { SearchBar } from "../ui/SearchBar";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="bg-white/90 sticky top-0 z-30 border-b border-slate-200 px-6 py-4 shadow-sm backdrop-blur-md transition-all">
      <div className="flex items-center justify-between gap-6">
        {/* Title Section */}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {/* Global Search - Tablet+ */}
        <div className="hidden md:block flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              className="w-full bg-slate-50 border-0 rounded-full py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-inner"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2.5 rounded-full hover:bg-slate-100 hover:text-blue-600 text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-100">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User Profile */}
          <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <button className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md ring-2 ring-white">
              <span className="font-bold text-sm">A</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800 leading-none">
                Admin
              </p>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
                User
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
