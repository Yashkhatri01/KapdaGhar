import { useEffect, useState } from "react";
import api from "../config/api";

export function useStartup() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Don't show the startup loader again in this browser tab.
    if (sessionStorage.getItem("kapdaghar-started")) {
      setReady(true);
      return;
    }

    let cancelled = false;

    async function wakeBackend() {
      const start = Date.now();
      const minimumAnimation = 1200;

      while (!cancelled) {
        try {
          // Wait until backend + SQLite database are actually responding.
          await api.get("/health");

          const elapsed = Date.now() - start;

          // Keep the animation visible for at least 1.2s.
          if (elapsed < minimumAnimation) {
            await new Promise((resolve) =>
              setTimeout(resolve, minimumAnimation - elapsed)
            );
          }

          // Small graceful delay before leaving the splash screen.
          await new Promise((resolve) => setTimeout(resolve, 400));

          if (!cancelled) {
            sessionStorage.setItem("kapdaghar-started", "true");
            setReady(true);
          }

          return;
        } catch {
          // Render free instance is probably still waking up.
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    wakeBackend();

    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}