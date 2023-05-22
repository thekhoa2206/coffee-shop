import { useRef } from "react";
import { equal } from "@wry/equality";

export function useDeepMemoValue<TValue>(value: TValue): TValue {
  const ref = useRef<TValue>();
  if (!ref.current || !equal(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}

export default useDeepMemoValue;
