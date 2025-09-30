// SFACAdmission.jsx (Main Component)
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import MainContent from "../components/MainContent";
import Footer from "../components/Footer";
import useLocalStorage from "../hooks/useLocalStorage"; // Extracted hook
import UNIVERSITIES from "../data/universities";

const STORAGE = {
  bookmarks: "sfac_bookmarks_v1",
  checklist: "sfac_checklist_v1",
};

export default function SFACMain() {
  const [query, setQuery] = useState("");
  const [loc, setLoc] = useState("all");
  const [program, setProgram] = useState("all");
  const [sort, setSort] = useState("deadline-asc");
  const [bookmarks, setBookmarks] = useLocalStorage(STORAGE.bookmarks, {});
  const [tasksByUni, setTasksByUni] = useLocalStorage(STORAGE.checklist, {});
  const [activeUni, setActiveUni] = useState(null);
  
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const checklistStats = useMemo(() => {
    const entries = Object.entries(tasksByUni);
    const totals = entries.map(([uid, list]) => ({ 
      uid, 
      total: list.length, 
      done: list.filter(t => t.done).length 
    }));
    const overallTotal = totals.reduce((a, b) => a + b.total, 0);
    const overallDone = totals.reduce((a, b) => a + b.done, 0);
    return { 
      totals, 
      overallTotal, 
      overallDone, 
      pct: overallTotal ? Math.round((overallDone/overallTotal)*100) : 0 
    };
  }, [tasksByUni]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <Navbar checklistStats={checklistStats} /> */}
        <MainContent
          query={query}
          setQuery={setQuery}
          loc={loc}
          setLoc={setLoc}
          program={program}
          setProgram={setProgram}
          sort={sort}
          setSort={setSort}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          tasksByUni={tasksByUni}
          setTasksByUni={setTasksByUni}
          activeUni={activeUni}
          setActiveUni={setActiveUni}
          prefersReducedMotion={prefersReducedMotion}
        />
        {/* <Footer /> */}
      </div>
    </div>
  );
}