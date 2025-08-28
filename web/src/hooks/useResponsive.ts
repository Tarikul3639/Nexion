"use client"

import { useMediaQuery } from "react-responsive"

export function useResponsive() {
  const isDesktop = useMediaQuery({ minWidth: 768 }) // md breakpoint
  return { isDesktop }
}
