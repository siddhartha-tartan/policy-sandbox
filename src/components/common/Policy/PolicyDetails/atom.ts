import { atom } from "jotai";
import { PolicyItem } from "../hooks/useGetPolicyByCategory";

export const selectedRowIdsAtom = atom<Set<string>>(new Set<string>());
export const unSelectedRowIdsAtom = atom<Set<string>>(new Set<string>());
export const selectAllAtom = atom<boolean>(false);
export const selectedPolicyAtom = atom<PolicyItem | null>(null);
