// Footer.jsx
import React from "react";
import { Info } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 text-xs text-muted-foreground flex items-center gap-2">
      <Info className="size-3" />
      <span>
        Data shown here is for demonstration. Always verify admissions details on each university's official site.
      </span>
    </footer>
  );
}