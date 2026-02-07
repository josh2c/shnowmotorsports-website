"use client";

import { useRef, useEffect } from "react";

interface LazyVideoProps {
  webmSrc: string;
  mp4Src: string;
  poster?: string;
  className?: string;
}

export default function LazyVideo({ webmSrc, mp4Src, poster, className = "" }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const mp4 = document.createElement("source");
        mp4.src = mp4Src;
        mp4.type = "video/mp4";

        const webm = document.createElement("source");
        webm.src = webmSrc;
        webm.type = "video/webm";

        video.appendChild(mp4);
        video.appendChild(webm);
        video.load();

        const play = () => {
          video.muted = true;
          video.play().catch(() => {});
        };

        if (video.readyState >= 3) {
          play();
        } else {
          video.addEventListener("canplay", play, { once: true });
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [mp4Src, webmSrc]);

  return (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      poster={poster}
      preload="none"
      className={className}
    />
  );
}
