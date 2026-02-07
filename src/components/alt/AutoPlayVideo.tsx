"use client";

import { useRef, useEffect, useState } from "react";

interface AutoPlayVideoProps {
  webmSrc: string;
  mp4Src: string;
  poster?: string;
  className?: string;
}

export default function AutoPlayVideo({ webmSrc, mp4Src, poster, className = "" }: AutoPlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [sourcesLoaded, setSourcesLoaded] = useState(false);

  // Intersection Observer — detect when video enters viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "200px" } // start loading 200px before visible
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Lazy-load sources when near viewport
  useEffect(() => {
    if (isVisible && !sourcesLoaded) {
      setSourcesLoaded(true);
    }
  }, [isVisible, sourcesLoaded]);

  // Play/pause based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !sourcesLoaded) return;

    // Fix React muted prop bug — must set via DOM property
    video.muted = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    if (isVisible) {
      const attemptPlay = () => {
        video.muted = true;
        const p = video.play();
        if (p !== undefined) {
          p.catch(() => {
            // Retry on first user interaction
            const retry = () => {
              video.muted = true;
              video.play().catch(() => {});
              document.removeEventListener("touchstart", retry);
              document.removeEventListener("scroll", retry);
            };
            document.addEventListener("touchstart", retry, { once: true });
            document.addEventListener("scroll", retry, { once: true });
          });
        }
      };

      if (video.readyState >= 3) {
        attemptPlay();
      } else {
        video.addEventListener("canplay", attemptPlay, { once: true });
      }
    } else {
      video.pause();
    }
  }, [isVisible, sourcesLoaded]);

  return (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      poster={poster}
      preload="none"
      className={className}
    >
      {sourcesLoaded && (
        <>
          <source src={mp4Src} type="video/mp4" />
          <source src={webmSrc} type="video/webm" />
        </>
      )}
    </video>
  );
}
