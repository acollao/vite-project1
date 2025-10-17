// MainContent.jsx
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Bookmark, BookmarkCheck, CalendarDays, School, MapPin, Clock, CheckCircle2, Plus, ChevronRight, Trash2, FileDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import UNIVERSITIES from "../data/universities";

// ... (Keep all helper functions and components: DeadlineBadge, EmptyState, GuideStep, AddTaskInline, TemplateButtons)

const DEFAULT_TASKS = (u) => [
  { id: `acc-${u.id}`, label: `Create account on ${u.name}`, done: false, uni: u.id },
  { id: `req-${u.id}`, label: `List required documents for ${u.name}`, done: false, uni: u.id },
  { id: `doc-${u.id}`, label: `Scan/photograph all docs for ${u.name}`, done: false, uni: u.id },
  { id: `fee-${u.id}`, label: `Pay fees (if applicable) for ${u.name}`, done: false, uni: u.id },
  { id: `sub-${u.id}`, label: `Submit application to ${u.name}`, done: false, uni: u.id },
];

const STORAGE = {
  bookmarks: "sfac_bookmarks_v1",
  checklist: "sfac_checklist_v1",
};

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  const target = new Date(dateStr + "T23:59:59");
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function DeadlineBadge({ deadline }) {
  const d = daysUntil(deadline);
  if (d == null) return null;
  const urgent = d <= 0;
  const soon = d <= 31;
  return (
    <Badge className={`text-xs ${urgent ? "bg-red-600" : soon ? "bg-amber-500" : "bg-emerald-600"}`} aria-label={`Deadline in ${d} days`}>
      <CalendarDays className="size-3 mr-1" /> {deadline} ({d} day{d === 1 ? "" : "s"} {d < 0 ? "ago" : "left"})
    </Badge>
  );
}

function EmptyState({ title, note, icon }) {
  const Icon = icon ?? Info;
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <Icon className="size-10 mb-3 opacity-70" aria-hidden />
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-muted-foreground max-w-md">{note}</p>
    </div>
  );
}

function GuideStep({ title, children }) {
  return (
    <div className="border rounded-2xl p-4 bg-slate-50">
      <div className="flex items-center gap-2 font-semibold mb-2">
        <ChevronRight className="size-4" /> {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

function AddTaskInline({ onAdd }) {
  const [val, setVal] = useState("");
  return (
    <div className="mt-3 flex gap-2">
      <Input value={val} onChange={e => setVal(e.target.value)} placeholder="Add a custom task…" aria-label="Add custom task" />
      <Button onClick={() => { onAdd(val.trim()); setVal(""); }}><Plus className="size-4 mr-1" /> Add</Button>
    </div>
  );
}

function TemplateButtons({ filename, content }) {
  function downloadText() {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="mt-2">
      <Button variant="outline" size="sm" onClick={downloadText}><FileDown className="size-4 mr-1" /> Download sample</Button>
    </div>
  );
}

export default function MainContent({
  query,
  setQuery,
  loc,
  setLoc,
  program,
  setProgram,
  sort,
  setSort,
  bookmarks,
  setBookmarks,
  tasksByUni,
  setTasksByUni,
  activeUni,
  setActiveUni,
  prefersReducedMotion
}) {
  // ... (Keep all useMemo hooks and helper functions: toggleBookmark, ensureTasksForUni, etc.)

    const programs = useMemo(() => {
        const set = new Set();
        UNIVERSITIES.forEach(u => u.programs.forEach(p => set.add(p)));
        return Array.from(set).sort();
    }, [UNIVERSITIES]);
  
    const filtered = useMemo(() => {
        let list = [...UNIVERSITIES];
        if (loc !== "all") list = list.filter(u => u.location === loc);
        if (program !== "all") list = list.filter(u => u.programs.includes(program));
        if (query.trim()) {
        const q = query.toLowerCase();
        list = list.filter(u => u.name.toLowerCase().includes(q) || u.programs.join(" ").toLowerCase().includes(q));
        }
        list.sort((a, b) => {
        if (sort === "deadline-asc") return (new Date(a.deadline)) - (new Date(b.deadline));
        if (sort === "deadline-desc") return (new Date(b.deadline)) - (new Date(a.deadline));
        if (sort === "name-asc") return a.name.localeCompare(b.name);
        if (sort === "name-desc") return b.name.localeCompare(a.name);
        return 0;
        });
        return list;
    }, [loc, program, query, sort, UNIVERSITIES]);

    function toggleBookmark(id) {
    setBookmarks(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function ensureTasksForUni(uni) {
    setTasksByUni(prev => {
      if (prev[uni.id]) return prev;
      return { ...prev, [uni.id]: DEFAULT_TASKS(uni) };
    });
  }

  function setTaskDone(uniId, taskId, done) {
    setTasksByUni(prev => ({
      ...prev,
      [uniId]: (prev[uniId] || []).map(t => t.id === taskId ? { ...t, done } : t)
    }));
  }

  function addCustomTask(uniId, label) {
    if (!label) return;
    setTasksByUni(prev => ({
      ...prev,
      [uniId]: [ ...(prev[uniId] || []), { id: `ct-${uniId}-${Date.now()}` , label, done: false, uni: uniId } ]
    }));
  }

  function removeTask(uniId, taskId) {
    setTasksByUni(prev => ({
      ...prev,
      [uniId]: (prev[uniId] || []).filter(t => t.id !== taskId)
    }));
  }

  const bookmarkedList = useMemo(() => 
    UNIVERSITIES.filter(u => bookmarks[u.id]), 
    [bookmarks]
  );

  const checklistStats = useMemo(() => {
    const entries = Object.entries(tasksByUni);
    const totals = entries.map(([uid, list]) => ({ uid, total: list.length, done: list.filter(t => t.done).length }));
    const overallTotal = totals.reduce((a, b) => a + b.total, 0);
    const overallDone = totals.reduce((a, b) => a + b.done, 0);
    return { totals, overallTotal, overallDone, pct: overallTotal ? Math.round((overallDone/overallTotal)*100) : 0 };
  }, [tasksByUni]);

  // ... (Keep all helper functions: toggleBookmark, ensureTasksForUni, etc.)

  return (
    <div className="space-y-6">

        <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4" /> Overall progress
            <Progress value={checklistStats.pct} className="w-40 [&>div]:bg-blue-500" aria-label={`Overall checklist ${checklistStats.pct}%`} />
            <span className="tabular-nums">{checklistStats.pct}%</span>
        </div>
        </div>

      {/* Search & Filter Card */}
      <Card className="mb-6">
        <CardContent className="p-4">
           <div className="grid grid-cols-1 md:grid-cols-5 gap-3" role="search" aria-label="Search and filter universities">
            <div className="md:col-span-2 flex items-center gap-2">
                <Search className="size-5 opacity-60" aria-hidden />
                <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search universities or programs…"
                aria-label="Search"
                className="w-full"
                />
            </div>

            <div className="flex items-center gap-2">
                <Filter className="size-5 opacity-60" aria-hidden />
                <Select value={loc} onValueChange={setLoc}>
                <SelectTrigger aria-label="Filter by location">
                    <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    <SelectItem value="Manila">Manila</SelectItem>
                    <SelectItem value="Taguig">Taguig</SelectItem>
                </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <Filter className="size-5 opacity-60" aria-hidden />
                <Select value={program} onValueChange={setProgram}>
                <SelectTrigger aria-label="Filter by program">
                    <SelectValue placeholder="Program" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All programs</SelectItem>
                    {programs.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <Filter className="size-5 opacity-60" aria-hidden />
                <Select value={sort} onValueChange={setSort}>
                <SelectTrigger aria-label="Sort results">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="deadline-asc">Deadline: Soonest</SelectItem>
                    <SelectItem value="deadline-desc">Deadline: Latest</SelectItem>
                    <SelectItem value="name-asc">Name: A → Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z → A</SelectItem>
                </SelectContent>
                </Select>
            </div>
            </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="universities" className="space-y-4">
       <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:w-[700px]">
            <TabsTrigger value="universities">Universities</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="checklist">Admission Checklist</TabsTrigger>
            <TabsTrigger value="guides">Document Guides</TabsTrigger>
          </TabsList>

          {/* Universities */}
          <TabsContent value="universities" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" role="list" aria-label="Universities list">
              <AnimatePresence initial={false}>
                {filtered.map(u => (
                  <motion.div key={u.id} layout initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <Card role="listitem" className="h-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <CardTitle className="text-lg leading-tight">{u.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <MapPin className="size-4" aria-hidden /> {u.location}
                            </CardDescription>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant={bookmarks[u.id] ? "default" : "outline"} size="icon" aria-label={bookmarks[u.id] ? "Remove bookmark" : "Bookmark university"} onClick={() => toggleBookmark(u.id)}>
                                  {bookmarks[u.id] ? <BookmarkCheck className="size-5" /> : <Bookmark className="size-5" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{bookmarks[u.id] ? "Saved" : "Save for later"}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <DeadlineBadge deadline={u.deadline} />
                          <Badge variant="outline" className="text-xs">
                            <Clock className="size-3 mr-1" /> {u.exam.name}: {u.exam.window}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 pb-4">
                        <div className="flex flex-wrap gap-2 my-3" aria-label="Programs offered">
                          {u.programs.map(p => (
                            <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          {u.requirements.length} common requirements listed
                        </div>
                        <div className="flex gap-2">
                          <a href={u.links.admissions} target="_blank" rel="noreferrer">
                            <Button variant="outline" aria-label="Open admissions page">Admissions</Button>
                          </a>
                          <a href={u.links.apply} target="_blank" rel="noreferrer">
                            <Button aria-label="Open apply page">Apply</Button>
                          </a>
                          <Dialog onOpenChange={(open) => open && setActiveUni(u)}>
                            <DialogTrigger asChild>
                              <Button variant="secondary" aria-label="View details"><Info className="size-4 mr-1" /> Details</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2"><School className="size-5" /> {u.name}</DialogTitle>
                                <DialogDescription>Requirements, deadlines, and quick actions.</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-3">
                                <div className="flex items-center gap-2"><MapPin className="size-4" /> {u.location}</div>
                                <div className="flex items-center gap-2"><CalendarDays className="size-4" /> Deadline: {u.deadline} ({daysUntil(u.deadline)} days left)</div>
                                <div className="flex items-center gap-2"><Clock className="size-4" /> Entrance: {u.exam.name} ({u.exam.window})</div>
                                <div>
                                  <div className="font-medium mb-1">Requirements</div>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {u.requirements.map(r => <li key={r}>{r}</li>)}
                                  </ul>
                                </div>
                              </div>
                              <DialogFooter className="gap-2">
                                <Button onClick={() => { ensureTasksForUni(u); }} variant="secondary"><Plus className="size-4 mr-1" /> Add tasks for this school</Button>
                                <Button onClick={() => { toggleBookmark(u.id); }}>
                                  {bookmarks[u.id] ? "Unsave" : "Save"}
                                </Button>
                                <a href={u.links.apply} target="_blank" rel="noreferrer"><Button>Go to Apply</Button></a>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {filtered.length === 0 && (
              <EmptyState title="No matches found" note="Try adjusting your filters or search keywords." />
            )}
          </TabsContent>

          {/* Bookmarks */}
          <TabsContent value="bookmarks">
            {bookmarkedList.length === 0 ? (
              <EmptyState title="No bookmarks yet" note="Tap the bookmark icon on a university to save it here." icon={Bookmark} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {bookmarkedList.map(u => (
                  <Card key={u.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{u.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <MapPin className="size-4" /> {u.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 pb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <DeadlineBadge deadline={u.deadline} />
                      </div>
                      <div className="flex gap-2">
                        <a href={u.links.admissions} target="_blank" rel="noreferrer"><Button variant="outline">Admissions</Button></a>
                        <a href={u.links.apply} target="_blank" rel="noreferrer"><Button>Apply</Button></a>
                        <Button variant="secondary" onClick={() => ensureTasksForUni(u)}><Plus className="size-4 mr-1" /> Add tasks</Button>
                        <Button variant="ghost" onClick={() => toggleBookmark(u.id)} aria-label="Remove bookmark"><BookmarkCheck className="size-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Checklist */}
          <TabsContent value="checklist" className="space-y-4">
            {Object.keys(tasksByUni).length === 0 ? (
              <EmptyState title="Your checklist is empty" note="Add tasks from a university's Details or Bookmarks." icon={CheckCircle2} />
            ) : (
              <div className="space-y-6">
                {Object.entries(tasksByUni).map(([uid, list]) => {
                  const uni = UNIVERSITIES.find(u => u.id === uid);
                  const done = list.filter(t => t.done).length;
                  const pct = list.length ? Math.round((done/list.length)*100) : 0;
                  return (
                    <Card key={uid}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <CardTitle className="text-lg">{uni?.name || "University"}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <CalendarDays className="size-4" /> Deadline: {uni?.deadline} ({daysUntil(uni?.deadline)} days left)
                            </CardDescription>
                          </div>
                          <div className="min-w-[200px]">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><CheckCircle2 className="size-4" /> {done}/{list.length} done</div>
                            <Progress value={pct} aria-label={`Progress ${pct}%`} />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-2">
                          {list.map(task => (
                            <li key={task.id} className="flex items-center gap-3 bg-slate-50 rounded-2xl px-3 py-2">
                              <Checkbox checked={task.done} onCheckedChange={(v) => setTaskDone(uid, task.id, Boolean(v))} aria-label={task.label} />
                              <span className={`flex-1 ${task.done ? "line-through text-muted-foreground" : ""}`}>{task.label}</span>
                              <Button size="icon" variant="ghost" onClick={() => removeTask(uid, task.id)} aria-label="Remove task">
                                <Trash2 className="size-4" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                        <AddTaskInline onAdd={(label) => addCustomTask(uid, label)} />
                      </CardContent>
                    </Card>
                  );
                })}

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Overall progress</CardTitle>
                    <CardDescription>Across all universities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Progress value={checklistStats.pct} className="w-full" aria-label={`Overall progress ${checklistStats.pct}%`} />
                      <div className="tabular-nums font-medium">{checklistStats.pct}%</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Guides */}
          <TabsContent value="guides" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Preparation Guide</CardTitle>
                <CardDescription>Step-by-step checklist and sample templates to help you prepare common requirements.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <GuideStep title="Request School Records (Form 137/138)">
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Visit your Registrar or request online if available.</li>
                    <li>Bring a valid ID and any required request form.</li>
                    <li>Ask for a <strong>Certified True Copy</strong> if needed.</li>
                  </ol>
                  <TemplateButtons filename="request-letter.txt" content={`Registrar\nSaint Francis of Assisi College – Taguig\n\nDear Registrar,\n\nI would like to request a copy of my Form 137/138 for college application purposes.\n\nSincerely,\n[Your Name]`} />
                </GuideStep>

                <GuideStep title="Secure PSA Birth Certificate">
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Order online via PSA or visit a PSA Serbilis Center.</li>
                    <li>Scan or photograph the certificate clearly.</li>
                    <li>Save as PDF with your full name.</li>
                  </ol>
                </GuideStep>

                <GuideStep title="Good Moral Certificate">
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Request from your Guidance Office.</li>
                    <li>Verify signatories and official seal.</li>
                    <li>Keep both physical and scanned copies.</li>
                  </ol>
                  <TemplateButtons filename="good-moral-request.txt" content={`To the Guidance Office,\n\nI am applying for college and would like to request a Good Moral Certificate.\n\nThank you,\n[Your Name]`} />
                </GuideStep>

                <GuideStep title="2x2 Photo & Scans">
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Plain white background, no accessories.</li>
                    <li>Save as <code>JPG</code> or <code>PNG</code>, 300 DPI if possible.</li>
                    <li>File naming: <code>LASTNAME_FIRSTNAME_2x2.jpg</code></li>
                  </ul>
                </GuideStep>

                <GuideStep title="Organize Your Files">
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Create a folder per university.</li>
                    <li>Use consistent file names.</li>
                    <li>Back up to cloud storage.</li>
                  </ul>
                </GuideStep>
              </CardContent>
            </Card>
          </TabsContent>
      </Tabs>
    </div>
  );
}