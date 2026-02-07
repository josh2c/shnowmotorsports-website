"use client";

import { useRef, useEffect } from "react";

interface AutoPlayVideoProps {
  webmSrc: string;
  mp4Src: string;
  poster?: string;
  className?: string;
}

export default function AutoPlayVideo({ webmSrc, mp4Src, poster, className = "" }: AutoPlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const tryPlay = video.play();
    if (tryPlay !== undefined) {
      tryPlay.catch(() => {
        // Retry on first user interaction
        const handleInteraction = () => {
          video.muted = true;
          video.play().catch(() => {});
          document.removeEventListener("touchstart", handleInteraction);
          document.removeEventListener("click", handleInteraction);
        };
        document.addEventListener("touchstart", handleInteraction, { once: true });
        document.addEventListener("click", handleInteraction, { once: true });
      });
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
      className={className}
    >
      <source src={webmSrc} type="video/webm" />
      <source src={mp4Src} type="video/mp4" />
    </video>
  );
}
