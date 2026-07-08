import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimerOption } from '../data/animals';

interface UseSleepTimerResult {
  timerOption: TimerOption;
  timeRemaining: number | null;
  setTimer: (option: TimerOption) => void;
  clearTimer: () => void;
  formattedTime: string | null;
}

export function useSleepTimer(onExpire: () => void): UseSleepTimerResult {
  const [timerOption, setTimerOption] = useState<TimerOption>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimerOption(null);
    setTimeRemaining(null);
  }, []);

  const setTimer = useCallback((option: TimerOption) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimerOption(option);
    if (option === null) {
      setTimeRemaining(null);
      return;
    }
    const totalSeconds = option * 60;
    setTimeRemaining(totalSeconds);
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTimerOption(null);
          onExpireRef.current();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const formattedTime = timeRemaining !== null
    ? `${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, '0')}`
    : null;

  return { timerOption, timeRemaining, setTimer, clearTimer, formattedTime };
}
