"use client";

import { useSyncExternalStore } from "react";

const sinSuscripcion = () => () => {};

/** Current year. The server prerender can't read the clock (Cache Components),
 *  so it renders `inicial`; the browser renders the real year. */
export function Anio({ inicial = 2026 }: { inicial?: number }) {
  const anio = useSyncExternalStore(
    sinSuscripcion,
    () => new Date().getFullYear(),
    () => inicial
  );
  return <>{anio}</>;
}
