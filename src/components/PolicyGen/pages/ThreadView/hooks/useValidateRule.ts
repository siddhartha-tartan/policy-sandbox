import { useAtomValue } from "jotai";
import { useQuery } from "react-query";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";
import { testResultAtom } from "../threadAtom";
export const getValidateRuleKey = `/category/{category_id}/policy/{policy_id}/file/{file_id}/validate-results/{request_id}`;
export interface ITestResult {
  name: string;
  actual: boolean;
  expected: boolean;
  failure_reason: string;
}
export default function useValidateRule() {
  const testResult = useAtomValue(testResultAtom);
  const fetchRules = async () => {
    return testResult as ITestResult[];
  };
  const { data, isLoading } = useQuery(
    [getValidateRuleKey],
    () => fetchRules(),
    {
      onError: queryErrorHandler,
    }
  );
  return { data, isLoading };
}
