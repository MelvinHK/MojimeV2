import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash-es";

/**
 * A hook that takes a default value, and whenever changed, reverts back to it after a set delay.
 * 
 * @param defaultValue - The value to reset back to.
 * @param delay - Time in milliseconds until value is reset to default.
 */
export const useAutoResetState = <T,>(defaultValue: T, delay: number) => {
  const [state, setState] = useState(defaultValue);

  const resetToInitalValue = useCallback(
    debounce(() => {
      setState(defaultValue);
    }, delay),
    [defaultValue, delay]
  );

  const setAutoResetState = (value: T) => {
    setState(value);
    resetToInitalValue();
  };

  useEffect(() => {
    return () => {
      resetToInitalValue.cancel();
    };
  }, [resetToInitalValue]);

  return [state, setAutoResetState] as const;
};