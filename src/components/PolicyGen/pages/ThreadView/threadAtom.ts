import { atom } from "jotai";
import { ITestResult } from "./hooks/useValidateRule";
import { BreRule } from "./utils/interface";

export const stepAtom = atom(0);
export const testStepAtom = atom(0);
export const csvFileAtom = atom<File | null>(null);
export const fileErrorAtom = atom("");
export const tempRulesAtom = atom<Record<string, string[]> | null>(null);
export const testResultAtom = atom<ITestResult[] | null>(null);
export const tabAtom = atom<"rule" | "summary" | "bre-rule">("rule");
export const comparePolicyAtom = atom<boolean>(false);
export const ruleEditKeyAtom = atom("");
export const isChatOpenAtom = atom(false);
export const isFullScreenAtom = atom(false);
export const variableMappingRequestIdAtom = atom<string>("");
export const codeRequestIdAtom = atom<string>("");
export const generatedCodeAtom = atom<string>("");
export const breRulesAtom = atom<BreRule[]>([]);
