"use client";

import React from "react";

interface CountdownButtonProps {
  children?: React.ReactNode;
  fallback: string;
  timeout?: number;
  onPress: () => void;
}

const START_RESEND_COUNTDOWN = 59;

export function CountdownButton({
  children,
  timeout = START_RESEND_COUNTDOWN,
  fallback,
  onPress,
}: CountdownButtonProps) {
  const [countdown, setCountdown] = React.useState(timeout);

  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const renderFallback = React.useMemo(() => {
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };
    return fallback?.replace(/:t:/g, formatTime(countdown));
  }, [fallback, countdown]);

  return (
    <div className="text-small text-foreground font-bold">
      {countdown > 0 ? (
        renderFallback
      ) : (
        <button className="cursor-pointer hover:underline" onClick={onPress}>
          {children}
        </button>
      )}
    </div>
  );
}
