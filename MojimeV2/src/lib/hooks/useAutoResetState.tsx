import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash-es";

/**
 * Takes a default state, and whenever changed, reverts back to it after a set delay.
 * 
 * @param defaultState - The state to reset back to.
 * @param delay - Time in milliseconds until value is reset to default.
 */
export const useAutoResetState = <T,>(defaultState: T, delay: number) => {
  const [state, setState] = useState(defaultState);

  const resetToInitalValue = useCallback(
    debounce(() => {
      setState(defaultState);
    }, delay),
    [defaultState, delay]
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