import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * Decorative CRT-style support terminal shown in the landing hero.
 *
 * This is a visual demonstration, not a real terminal: the sample community
 * and reference are the fictional values the previous hero card already used,
 * and nothing here is wired to application data.
 *
 * The convex screen is a shading illusion (highlight + vignette), not a
 * geometric warp — terminal text stays straight and readable.
 */

type StatusRow = {
  label: string;
  value: string;
  emphasis?: boolean;
};

const STATUS_ROWS: StatusRow[] = [
  { label: "COMMUNITY", value: "Pixel Forge" },
  { label: "STATUS", value: "SUPPORT RECEIVED", emphasis: true },
  { label: "CONTRIBUTION", value: "5 MON" },
  { label: "REFERENCE", value: "0x1a2b…c3d4" },
];

const CONFIRMATIONS = [
  "Support recorded",
  "Confirmation available",
  "Activity updated",
];

export function SupportTerminal({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "crt-housing w-full max-w-[420px] rounded-[22px] p-2.5 sm:p-3",
        className
      )}
    >
      <div className="crt-bezel rounded-[16px] p-3 sm:p-3.5">
        <div className="crt-screen relative overflow-hidden rounded-[10px]">
          {/* Decorative screen layers — above the content, never clickable. */}
          <div
            className="crt-scanlines pointer-events-none absolute inset-0 z-20"
            aria-hidden="true"
          />
          <div
            className="crt-convex pointer-events-none absolute inset-0 z-20"
            aria-hidden="true"
          />
          <div
            className="crt-vignette pointer-events-none absolute inset-0 z-20"
            aria-hidden="true"
          />

          <div className="relative z-30 min-h-[310px] font-mono text-[12.5px] leading-[1.65] sm:text-[13px]">
            <div className="flex items-center justify-between border-b border-[#393044]/60 px-4 py-2.5 sm:px-5">
              <span className="flex items-center gap-2 tracking-[0.14em] text-[#D9C7FF]">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[#A970FF] shadow-[0_0_6px_rgba(169,112,255,0.85)]"
                  aria-hidden="true"
                />
                SUTU
              </span>
              <span className="flex items-center gap-2 text-[11px] tracking-[0.12em] text-[#9585B5]">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[#A970FF] shadow-[0_0_8px_rgba(169,112,255,0.9)]"
                  aria-hidden="true"
                />
                SIGNAL OK
              </span>
            </div>

            <div className="px-4 py-4 sm:px-5 sm:py-5">
              <p className="text-[#9585B5]">sutu://community</p>
              <p className="crt-glow mt-1 text-[#D9C7FF]">
                <span className="text-[#A970FF]">$</span> community.status()
              </p>

              <dl className="mt-4 grid grid-cols-[7.5rem_1fr] gap-x-3 gap-y-1.5 sm:grid-cols-[8.5rem_1fr]">
                {STATUS_ROWS.map(({ label, value, emphasis }) => (
                  <Fragment key={label}>
                    <dt className="text-[#9585B5]">{label}</dt>
                    <dd
                      className={cn(
                        "min-w-0 break-words",
                        emphasis
                          ? "crt-glow-strong text-[#A970FF]"
                          : "text-[#D9C7FF]"
                      )}
                    >
                      {value}
                    </dd>
                  </Fragment>
                ))}
              </dl>

              <div className="mt-4 space-y-1">
                {CONFIRMATIONS.map((line) => (
                  <p key={line} className="text-[#D9C7FF]">
                    <span className="text-[#A970FF]">[OK]</span> {line}
                  </p>
                ))}
              </div>

              <p className="mt-4 text-[#D9C7FF]">
                <span className="text-[#A970FF]">$</span>{" "}
                <span
                  className="crt-cursor inline-block h-[1.05em] w-[0.55em] translate-y-[0.15em] bg-[#A970FF]"
                  aria-hidden="true"
                />
              </p>
            </div>
          </div>
        </div>

        {/* Engraved label + power indicator on the monitor shell. */}
        <div className="mt-2.5 flex items-center justify-between px-1.5">
          <span className="font-mono text-[9.5px] tracking-[0.22em] text-[#4e4759]">
            SUTU · SUPPORT TERMINAL
          </span>
          <span
            className="h-1 w-1 rounded-full bg-[#A970FF]/70 shadow-[0_0_5px_rgba(169,112,255,0.6)]"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
