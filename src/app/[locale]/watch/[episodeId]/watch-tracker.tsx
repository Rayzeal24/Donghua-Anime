"use client";

import { useEffect } from "react";

interface WatchTrackerProps {
  episodeId: string;
  userId: string;
}

export function WatchTracker({ episodeId }: WatchTrackerProps) {
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId,
          progress: Math.floor(Date.now() / 1000) % 3600,
          duration: 1200,
        }),
      }).catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [episodeId]);

  return null;
}
