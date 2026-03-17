import { atom } from "jotai";
import { MultiplePolicySelection } from "../common/MultiplePolicySelectionModal";
import { ConversationMessage } from "./hooks/useGetMessages";

export const queryAtom = atom("");
export const selectedCategoryIdAtom = atom("");
export const selectedPoliciesAtom = atom<MultiplePolicySelection[] | null>(
  null
);
export const isLoadingAtom = atom(false);
export const conversationAtom = atom<ConversationMessage[]>([]);
