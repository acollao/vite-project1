// Navbar.jsx
import React from "react";
import { Link, useLocation } from 'react-router-dom';
import { School, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Navbar({ checklistStats }) {
  const location = useLocation();
  const showProgress = location.pathname === '/admissions';

  return (
    <header className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 shadow-lg">
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        <School className="size-7" aria-hidden />
        <Link to="/" className="text-2xl font-bold hover:opacity-80">
          SFAC Taguig – College Admissions Hub
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <nav className="flex gap-4">
          <Link to="/" className={location.pathname === '/' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}>
            Home
          </Link>
          <Link to="/admissions" className={location.pathname === '/admissions' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}>
            Admissions
          </Link>
          <Link to="/contributor" className={location.pathname === '/contributor' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}>
            Contributors
          </Link>
        </nav>

        {/* {showProgress && checklistStats && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4" /> Overall progress
            <Progress value={checklistStats.pct} className="w-40" />
            <span className="tabular-nums">{checklistStats.pct}%</span>
          </div>
        )} */}
      </div>
    </header>
  );
}