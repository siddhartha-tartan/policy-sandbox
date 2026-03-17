import { atom } from "jotai";
import { IUser } from "../../../hooks/useGetUsers";

export const selectedEditUserAtom = atom<IUser | null>(null);
