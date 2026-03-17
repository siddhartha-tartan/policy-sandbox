import { atom } from "jotai";

export const startDateAtom = atom<Date | null>(null);
export const endDateAtom = atom<Date | null>(null);
export const dateSelectionAtom = atom<"duration" | "date">("duration");
