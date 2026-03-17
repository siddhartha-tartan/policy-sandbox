import { atom } from "jotai";
import { IComparison } from "./hooks/useGetPolicyComparison";

export const policyComparisonData = atom<IComparison | null>(null);
