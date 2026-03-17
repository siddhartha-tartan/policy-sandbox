import { useAtom } from "jotai";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MOCK_POLICY_COMPARISON } from "../../../../mock/mockData";
import { PolicyGenParamsEnum } from "../../../PolicyGen/pages/ThreadView/utils/constant";
import { policyComparisonData } from "../atom";

export interface IPolicyComparisonResponse {
  id: string;
  base_policy_file_id: string;
  compare_policy_file_id: string;
  result: string;
}

export interface NormData {
  additions: string[];
  deletions: string[];
  updates: string[];
}
export type IComparison = Record<string, NormData>;

export const getPolicyComparisonKey = (
  baseFileId?: string,
  compareFileId?: string
) => ["/compare-policies", baseFileId, compareFileId];

export const useGetPolicyComparison = () => {
  const location = useLocation();
  const baseFileId = new URLSearchParams(location.search).get(
    PolicyGenParamsEnum.BASE_FILE_ID
  );
  const compareFileId = new URLSearchParams(location.search).get(
    PolicyGenParamsEnum.COMPARE_FILE_ID
  );

  const [comparisonData, setComparisonData] = useAtom(policyComparisonData);

  useEffect(() => {
    if (baseFileId && compareFileId && !comparisonData) {
      const key = `${baseFileId}_${compareFileId}`;
      const reverseKey = `${compareFileId}_${baseFileId}`;
      const mockResult =
        MOCK_POLICY_COMPARISON[key] ||
        MOCK_POLICY_COMPARISON[reverseKey] ||
        Object.values(MOCK_POLICY_COMPARISON)[0];
      setComparisonData(mockResult);
    }
  }, [baseFileId, compareFileId]);

  return {
    data: comparisonData,
    isLoading: false,
  };
};
