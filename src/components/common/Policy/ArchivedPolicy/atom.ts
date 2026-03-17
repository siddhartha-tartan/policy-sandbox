import { atom } from "jotai";
import { ArchivePolicyItem } from "../hooks/useGetArchivePolicy";

export const restorePolicyAtom = atom<ArchivePolicyItem | null>(null);
