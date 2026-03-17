import { atom } from "jotai";
import {
  IAssesmentDetails,
  IQuestions,
} from "./pages/IndivisualAssesment/hooks/useGetAssesment";
export const editAtom = atom<boolean>(false);
export const assesmentDataAtom = atom<IAssesmentDetails | null>(null);
export const errorAtom = atom({});
export const selectedRowIdsAtom = atom<Set<string>>(new Set<string>());
export const unSelectedRowIdsAtom = atom<Set<string>>(new Set<string>());
export const selectAllAtom = atom<boolean>(false);
export const emailsAtom = atom<string[]>([]);
export const bulkUploadQuestionsAtom = atom<IQuestions[]>([]);
export const fileErrorAtom = atom("");
export const bulkUploadType = atom<"ai" | "csv" | "manual" | null>(null);
export const AiGenerateQuestionStateAtom = atom<any>(null);
