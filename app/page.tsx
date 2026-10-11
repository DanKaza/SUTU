"use client";

import { useEffect, useState } from "react";

/**
 * TEMPORARY artboard wrapper.
 *
 * The landing page is pinned to a fixed 1920x1080 frame so the design can be
 * reviewed at its design resolution instead of adapting to the visitor's
 * window. The real page (nav, footer, every section) renders at
 * `/landing-frame` inside the iframe; this route only draws and scales it.
 *
 * Why an iframe: the viewport *inside* the frame is exactly 1920x1080, so
 * every Tailwind breakpoint — and every `window.innerWidth` measurement in
 * client code such as AsciiField — evaluates as if the screen were 1920x1080.
 * Wrapping the sections in a scaled div would not do that, because CSS media
 * queries still read the real window size.
 *
 * Set FIT to false to render the artboard 1:1 instead of scaling it to fit.
 *
 * To go back to a normal responsive landing page: restore the previous
 * `app/page.tsx` (it lives on in `components/landing/landing-page.tsx`) and
 * delete `app/landing-frame/`.
 */

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
/** true → seluruh artboard 1920x1080 selalu terlihat (letterbox). false → 1:1. */
const FIT = true;

type Frame = { scale: number; x: number; y: number };

export default function LandingArtboard() {
  const [frame, setFrame] = useState<Frame | null>(null);

  useEffect(() => {
    const update = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scale = FIT
        ? Math.min(viewportWidth / DESIGN_WIDTH, viewportHeight / DESIGN_HEIGHT)
        : 1;

      setFrame({
        scale,
        x: Math.max(0, (viewportWidth - DESIGN_WIDTH * scale) / 2),
        y: Math.max(0, (viewportHeight - DESIGN_HEIGHT * scale) / 2),
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /**
   * Same origin, so we can reach into the frame: hide its own scrollbar,
   * otherwise the inner viewport would be 1905px wide instead of 1920px.
   * Scrolling still works; only the bar is hidden.
   */
  const handleLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    const doc = event.currentTarget.contentDocument;
    if (!doc || doc.getElementById("artboard-scrollbar")) return;

    const style = doc.createElement("style");
    style.id = "artboard-scrollbar";
    style.textContent =
      "html{scrollbar-width:none;-ms-overflow-style:none}html::-webkit-scrollbar{display:none}";
    doc.head.appendChild(style);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-[#08080B]">
      {frame ? (
        <iframe
          src="/landing-frame"
          title="Landing — 1920x1080"
          width={DESIGN_WIDTH}
          height={DESIGN_HEIGHT}
          onLoad={handleLoad}
          style={{
            position: "absolute",
            left: frame.x,
            top: frame.y,
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            border: 0,
            transform: `scale(${frame.scale})`,
            transformOrigin: "top left",
          }}
        />
      ) : null}
    </div>
  );
}
