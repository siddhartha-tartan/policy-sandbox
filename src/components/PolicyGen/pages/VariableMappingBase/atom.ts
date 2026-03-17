import { atom } from "jotai";
import { IAddDestinationVariable } from "./hooks/useAddDestinationVariables";

export const variableParsedData = atom<IAddDestinationVariable[]>([]);
export const destinationVariablesAtom = atom<string[]>([]);
