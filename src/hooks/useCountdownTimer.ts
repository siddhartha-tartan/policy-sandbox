import { useState, useEffect, useRef } from "react";
export default function useCountdownTimer(count = 60) {
  const [value, setValue] = useState(count);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Extract the decrement logic to a separate function
  const decrementValue = () => {
    setValue((prevValue) => {
      if (prevValue === 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        return prevValue;
      }
      return prevValue - 1;
    });
  };
  // Clear existing timer
  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  // Start a new timer
  const startTimer = () => {
    clearTimer();
    timerRef.current = setInterval(decrementValue, 1000);
  };
  // Restart the timer
  const restart = () => {
    setValue(count);
  };
  // Initialize timer on mount and when count or restart changes
  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [count, restart]);
  return { value, restart };
}
