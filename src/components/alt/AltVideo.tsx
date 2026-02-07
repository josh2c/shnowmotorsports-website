"use client";

import { useRef, useEffect, useState } from "react";
import { basePath } from "@/lib/base-path";

const ALT_RED = "#ff2d2d";

export default function AltVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playFailed, setPlayFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt autoplay — if blocked, show play button fallback
    const tryPlay = video.play();
    if (tryPlay !== undefined) {
      tryPlay.catch(() => setPlayFailed(true));
    }
  }, []);

  const handleManualPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().then(() => setPlayFailed(false)).catch(() => {});
  };

  return (
    <section>
      {/* Full-bleed video */}
      <div className="relative w-full h-[70vh] md:h-screen overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={`${basePath}/images/hero/car.webp`}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={`${basePath}/images/hero/motorvid.webm`} type="video/webm" />
          <source src={`${basePath}/images/hero/motorvid.mp4`} type="video/mp4" />
        </video>

        {/* Play button fallback if autoplay blocked */}
        {playFailed && (
          <button
            onClick={handleManualPlay}
            className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
            aria-label="Play video"
          >
            <div
              className="w-20 h-20 rounded-full border-2 flex items-center justify-center backdrop-blur-sm bg-black/20"
              style={{ borderColor: ALT_RED }}
            >
              <svg className="w-8 h-8 ml-1" fill={ALT_RED} viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}
      </div>

      {/* Info bar */}
      <div
        className="flex items-center justify-between px-6 md:px-16 lg:px-24 py-6 font-mono text-xs md:text-sm tracking-[0.2em] uppercase"
        style={{ color: ALT_RED }}
      >
        <span>BUFFALO BASED</span>
        <span>EST (2024)</span>
      </div>
    </section>
  );
}
