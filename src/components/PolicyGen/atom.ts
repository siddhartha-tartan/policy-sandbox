import { atom } from "jotai";

export const rulesAtom = atom<Record<string, string[]> | null>(null);
export const summaryAtom = atom<string>("");
export const rulesLoadingAtom = atom<boolean>(false);
export const summaryLoadingAtom = atom<boolean>(false);
