import { atom } from "jotai";

export const selectedRowIdsAtom = atom<Set<string>>(new Set<string>());
export const unSelectedRowIdsAtom = atom<Set<string>>(new Set<string>());
export const selectAllAtom = atom<boolean>(false);
export const selectedVersionAtom = atom<Record<string, string>>({});
