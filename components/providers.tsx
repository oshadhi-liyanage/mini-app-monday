"use client";

import { MiniAppProvider } from "@/contexts/miniapp-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <MiniAppProvider addMiniAppOnLoad={true}>{children}</MiniAppProvider>;
}
