import { atom } from "jotai";
import { ILoanCategory } from "../../../../hooks/useGetLoanCategories";

export const selectedCategoryAtom = atom<ILoanCategory | null>(null);
