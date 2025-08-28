"use client"
import { useState, useEffect } from "react";

export function useResponsive() {
  const [isDesktop, setIsDesktop] = useState(false); // SSR-safe default

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isDesktop };
}
