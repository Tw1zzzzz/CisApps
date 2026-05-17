import { useCallback, useEffect, useRef, useState } from "react";

export type AsyncState<T> =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "empty"; data: T; error: null }
  | { status: "error"; data: null; error: string };

export function useAsync<T>(load: () => Promise<T>, isEmpty: (value: T) => boolean = () => false) {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading", data: null, error: null });
  const isEmptyRef = useRef(isEmpty);

  useEffect(() => {
    isEmptyRef.current = isEmpty;
  }, [isEmpty]);

  const reload = useCallback(async () => {
    setState({ status: "loading", data: null, error: null });
    try {
      const data = await load();
      setState(isEmptyRef.current(data) ? { status: "empty", data, error: null } : { status: "success", data, error: null });
    } catch {
      setState({ status: "error", data: null, error: "Не удалось загрузить данные." });
    }
  }, [load]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { state, reload };
}
