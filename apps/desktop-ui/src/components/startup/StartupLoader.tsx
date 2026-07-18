import { useEffect, useState } from "react";
import "./StartupLoader.css";
type Props = {
  ready: boolean;
};

const messages = [
  "Starting KapdaGhar...",
  "Waking up the server...",
  "Connecting to database...",
  "Loading inventory...",
  "Loading customers...",
  "Preparing dashboard...",
  "Checking reports...",
  "Organizing workspace...",
  "Almost ready..."
];

export default function StartupLoader({ ready }: Props) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (ready) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [ready]);

  return (
    <div
      className={`startup-bg fixed inset-0 z-[9999] flex items-center justify-center bg-[#F8F6F1]
    transition-all duration-700 ease-out
    ${ready ? "opacity-0 pointer-events-none" : "opacity-100"}
    `}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E5CEBC]/40 blur-3xl" />
        <div
  className="
    absolute inset-0
    opacity-[0.03]
    pointer-events-none
  "
  style={{
    backgroundImage: `
      repeating-linear-gradient(
        90deg,
        #000 0px,
        transparent 2px,
        transparent 6px
      ),
      repeating-linear-gradient(
        0deg,
        #000 0px,
        transparent 2px,
        transparent 6px
      )
    `,
  }}
/>
      </div>

      <div className="relative flex w-full max-w-xl flex-col items-center px-8">

        {/* Logo */}
        <img
          src="/logo.svg"
          alt="KapdaGhar"
          className="startup-logo mb-8 h-24 w-24 select-none"
          draggable={false}
        />

        {/* Brand */}
        <h1 className="text-5xl font-bold tracking-wide text-[#2E2A27]">
          KapdaGhar
        </h1>

        <p className="mt-3 text-sm tracking-[0.35em] uppercase text-[#8A817A]">
          Garment Shop Management
        </p>

        {/* Stitch Line */}

<div className="mt-14 relative w-full overflow-hidden">

  <div className="startup-line" />

  <div className="startup-thread" />

  <div className="startup-needle">

    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M18 3L7 14L10 17L21 6"
        stroke="#B78628"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="18"
        cy="3"
        r="1.5"
        stroke="#B78628"
        strokeWidth="1.4"
      />

    </svg>

  </div>

</div>

        {/* Status */}
        <div className="mt-10 flex h-8 items-center gap-3">

          {!ready ? (
            <>
              <div className="h-2.5 w-2.5 rounded-full bg-[#B78628] startup-pulse" />

              <span className="startup-message text-sm tracking-wide text-[#5D5752]">
                {messages[messageIndex]}
              </span>
            </>
          ) : (
            <>
              <div className="text-xl text-green-600">
                ✓
              </div>

              <span className="font-medium text-green-700">
                Workspace Ready
              </span>
            </>
          )}

        </div>
      </div>
    </div>
  );
}