import { useCallback, useRef, useState } from "react";

type UseDelayedExecutorProps = {
  callback: () => void;
  timer?: number;
};

type UseDelayedExecutorReturn = {
  execute: () => void;
  isRunning: boolean;
  cancel: () => void;
};

export function useDelayedExecutor({
  callback,
  timer = 3000,
}: UseDelayedExecutorProps): UseDelayedExecutorReturn {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const execute = useCallback(() => {
    // Cancelar timeout anterior si existe
    cancel();

    // Iniciar nuevo timeout
    setIsRunning(true);

    timeoutRef.current = setTimeout(() => {
      callback();
      setIsRunning(false);
      timeoutRef.current = null;
    }, timer);
  }, [callback, timer, cancel]);

  return { execute, isRunning, cancel };
}
