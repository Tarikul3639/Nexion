import { useEffect } from "react";

export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
  active: boolean = true
) {
  useEffect(() => {
    if (!active) return;

    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mouseup", handleClick);
    return () => document.removeEventListener("mouseup", handleClick);
  }, [ref, callback, active]);
}

