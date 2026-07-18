import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import "./index.css";
import App from "./App";
import { SidebarProvider } from "./contexts/SidebarContext";
import { ToastProvider } from "./contexts/ToastContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
    <SidebarProvider>
      <App />
      <Analytics />
      <SpeedInsights />
    </SidebarProvider>
    </ToastProvider>
  </StrictMode>
);