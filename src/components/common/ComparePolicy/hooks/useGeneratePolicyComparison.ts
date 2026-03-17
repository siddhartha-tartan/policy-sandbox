import { useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_POLICY_COMPARISON } from "../../../../mock/mockData";
import { PolicyGenParamsEnum } from "../../../PolicyGen/pages/ThreadView/utils/constant";
import { policyComparisonData } from "../atom";

export const comparePolicyKey = `/agents/compare-policies`;

export interface IRequestPolicyComparison {
  base_policy_file_id: string;
  compare_policy_file_id: string;
}

export default function useGeneratePolicyComparison(onSuccess?: () => void) {
  const navigate = useNavigate();
  const setComparisonData = useSetAtom(policyComparisonData);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(
    (
      payload: IRequestPolicyComparison,
      options?: { onSuccess?: (data: any) => void }
    ) => {
      setIsLoading(true);

      setTimeout(() => {
        const key = `${payload.base_policy_file_id}_${payload.compare_policy_file_id}`;
        const reverseKey = `${payload.compare_policy_file_id}_${payload.base_policy_file_id}`;
        const mockResult =
          MOCK_POLICY_COMPARISON[key] ||
          MOCK_POLICY_COMPARISON[reverseKey] ||
          Object.values(MOCK_POLICY_COMPARISON)[0];

        setComparisonData(mockResult);

        const currentParams = new URLSearchParams(location.search);
        currentParams.set(
          PolicyGenParamsEnum.BASE_FILE_ID,
          payload.base_policy_file_id
        );
        currentParams.set(
          PolicyGenParamsEnum.COMPARE_FILE_ID,
          payload.compare_policy_file_id
        );
        navigate(`?${currentParams.toString()}`, { replace: false });

        setIsLoading(false);
        options?.onSuccess?.({ status: "Completed" });
        onSuccess?.();
      }, 800);
    },
    [navigate, setComparisonData, onSuccess]
  );

  return { mutate, isLoading };
}
