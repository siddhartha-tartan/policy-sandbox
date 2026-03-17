import { atom } from "jotai";
import { IAddWorkFlow, IWorkFlowLevel } from "./hooks/useAddWorkFlow";

export const initialWorkFlowValues = {
  name: "",
  module_id: [],
  entity_types: [],
};

export const workflowFormDataAtom = atom<Omit<IAddWorkFlow, "levels">>(
  initialWorkFlowValues
);
export const levelFormDataAtom = atom<IWorkFlowLevel[]>([]);
