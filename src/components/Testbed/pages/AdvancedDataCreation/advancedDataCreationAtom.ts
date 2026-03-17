import { atom } from "jotai";
import { PolicyDetails } from "../../../common/Policy/hooks/useGetPolicyDetails";
import { Variable } from "./hooks/useGetVariables";
import { TestDataResponse } from "./hooks/useGenerateTest";
import { RunSimulation } from "./hooks/useRunSimulation";

export const policyDataAtom = atom<PolicyDetails | null>(null);
export const rulesCheckedStateAtom = atom<Record<string, boolean>>({});
export const uniqueVariablesAtom = atom<Variable[]>([]);
export const ruleConfigsAtom = atom<Record<string, any>>({});
export const testDataAtom = atom<TestDataResponse[]>([]);
export const selectedTestDataAtom = atom<TestDataResponse[]>([]);
export const runSimulationDataAtom = atom<RunSimulation[]>([]);
