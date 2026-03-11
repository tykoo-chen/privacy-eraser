"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface SSEEvent {
  event: string;
  data: unknown;
}

export function useSSE(url: string | null) {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const reset = useCallback(() => {
    setEvents([]);
    setIsConnected(false);
    setIsDone(false);
  }, []);

  useEffect(() => {
    if (!url) return;

    reset();
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => setIsConnected(true);

    es.addEventListener("progress", (e) => {
      setEvents((prev) => [...prev, { event: "progress", data: JSON.parse(e.data) }]);
    });

    es.addEventListener("result", (e) => {
      setEvents((prev) => [...prev, { event: "result", data: JSON.parse(e.data) }]);
    });

    es.addEventListener("step", (e) => {
      setEvents((prev) => [...prev, { event: "step", data: JSON.parse(e.data) }]);
    });

    es.addEventListener("complete", (e) => {
      setEvents((prev) => [...prev, { event: "complete", data: JSON.parse(e.data) }]);
      setIsDone(true);
      es.close();
    });

    es.addEventListener("error", (e) => {
      if (e instanceof MessageEvent) {
        setEvents((prev) => [...prev, { event: "error", data: JSON.parse(e.data) }]);
      }
      setIsDone(true);
      es.close();
    });

    es.onerror = () => {
      setIsConnected(false);
      setIsDone(true);
      es.close();
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [url, reset]);

  return { events, isConnected, isDone, reset };
}
