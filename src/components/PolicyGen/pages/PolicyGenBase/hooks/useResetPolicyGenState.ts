import { useSetAtom } from "jotai";
import {
  rulesAtom,
  rulesLoadingAtom,
  summaryAtom,
  summaryLoadingAtom,
} from "../../../atom";
import {
  breRulesAtom,
  isChatOpenAtom,
  isFullScreenAtom,
  stepAtom,
  tabAtom,
} from "../../ThreadView/threadAtom";

export default function useResetPolicyGenState() {
  const setRules = useSetAtom(rulesAtom);
  const setSummary = useSetAtom(summaryAtom);
  const setBreRules = useSetAtom(breRulesAtom);
  const setRulesLoading = useSetAtom(rulesLoadingAtom);
  const setSummaryLoading = useSetAtom(summaryLoadingAtom);
  const setStep = useSetAtom(stepAtom);
  const setTab = useSetAtom(tabAtom);
  const setIsChatOpen = useSetAtom(isChatOpenAtom);
  const setIsFullScreen = useSetAtom(isFullScreenAtom);

  const resetPolicyGenState = () => {
    setRules(null);
    setSummary("");
    setBreRules([]);
    setRulesLoading(false);
    setSummaryLoading(false);
    setStep(0);
    setTab("rule");
    setIsChatOpen(false);
    setIsFullScreen(false);
  };

  return { resetPolicyGenState };
}
