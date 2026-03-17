import { atom } from "jotai";
import { IThread } from "./hooks/useGetThread";

export const replyAtom = atom<string>("");
export const discussionAtom = atom<IThread | null>(null);
