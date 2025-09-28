// atoms/metricsAtom.ts
import { atom } from "jotai";
import type { MetricsData } from "@/interfaces/MetricsData";

export const metricsAtom = atom<{
  data: MetricsData | undefined;
  timestamp: number | null;
}>({
  data: undefined,
  timestamp: null,
});
