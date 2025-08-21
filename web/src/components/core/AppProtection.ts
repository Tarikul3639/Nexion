"use client";

import { useEffect } from "react";

export default function AppProtection() {
  useEffect(() => {
    // Disable right-click
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", blockContextMenu);

    // Disable drag events
    const blockDrag = (e: DragEvent) => e.preventDefault();
    document.addEventListener("dragstart", blockDrag);

    // Disable keyboard shortcuts
    const blockShortcuts = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
        (e.ctrlKey && e.key.toLowerCase() === "u") ||
        (e.ctrlKey && e.key.toLowerCase() === "s") ||
        (e.ctrlKey && e.key.toLowerCase() === "c")
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", blockShortcuts);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("dragstart", blockDrag);
      document.removeEventListener("keydown", blockShortcuts);
    };
  }, []);

  return null;
}
