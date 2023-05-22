import { useState, useCallback } from "react";

function useBooleanState(initialValue: boolean) {
  const [value, setValue] = useState(initialValue);
  const setTrue = useCallback(() => setValue(true), [setValue]);
  const setFalse = useCallback(() => setValue(false), [setValue]);
  return { value, setTrue, setFalse };
}
export default useBooleanState;
