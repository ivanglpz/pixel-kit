import { useCallback, useRef, useState } from "react";

type UseDelayedExecutorProps = {
  callback: () => void;
  timer?: number;
};

type UseDelayedExecutorReturn = {
  execute: () => void;
  isRunning: boolean;
};

export function useDelayedExecutor({
  callback,
  timer = 3000,
}: UseDelayedExecutorProps): UseDelayedExecutorReturn {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const execute = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);

    timeoutRef.current = setTimeout(() => {
      callback();
      setIsRunning(false);
    }, timer);
  }, [callback, timer, isRunning]);

  return { execute, isRunning };
}
