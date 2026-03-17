import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../auth";
import { userStore } from "../../../../../store/userStore";
import { BASE_ROUTES } from "../../../../../utils/constants/constants";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";
import { runSimulationDataAtom } from "../advancedDataCreationAtom";
import { TESTBED_SUB_ROUTES } from "../../../contants";
import { HISTORICAL_DATA_TESTING_SUB_ROUTES } from "../../HistoricalDataTesting/constants";
import { ADVANCED_DATA_CREATION_SUB_ROUTES } from "../constants";

export interface RunSimulation {
  id: string;
  actual_result: "pass" | "fail";
  match_status?: "match" | "mismatch"; // optional
  rejection_reasons: Array<{
    variable_title: string;
    condition_expression: string;
    rule_description: string;
    rule_id: string;
  }> | null; // optional
}

interface RunSimulationResponse {
  status_code: number;
  message: string;
  data: Array<RunSimulation>;
}

const runSimulationEndpoint = (fileId: string) =>
  `${API_BASE_URL}/test-bed/file/${fileId}/run-simulation`;

export default function useRunSimulation() {
  const axios = getProtectedAxios();

  const runSimulation = async (
    fileId: string,
    testCases: Record<string, string | boolean | number>[]
  ): Promise<RunSimulationResponse> => {
    const response = await axios.post<RunSimulationResponse>(
      runSimulationEndpoint(fileId),
      testCases?.map((row, index) => {
        return { ...row, id: (index + 1).toString() };
      })
    );
    return response.data;
  };

  const { mutate, isLoading, error, data } = useMutation(
    [runSimulationEndpoint("")],
    ({
      fileId,
      testCases,
    }: {
      fileId: string;
      testCases: Record<string, string | boolean | number>[];
    }) => runSimulation(fileId, testCases),
    { onError: queryErrorHandler }
  );

  const setRunSimulationData = useSetAtom(runSimulationDataAtom);
  const navigate = useNavigate();
  const { fileId, categoryId, policyId } = useParams();
  const { userType } = userStore();
  const location = useLocation();
  useEffect(() => {
    if (data) {
      setRunSimulationData(data?.data);
      const isAdvancedDataCreation = location.pathname?.includes(
        TESTBED_SUB_ROUTES.ADVANCED_DATA_CREATION
      );
      const baseRoute = `${BASE_ROUTES[userType]}/testbed`;
      const testbedType = isAdvancedDataCreation
        ? TESTBED_SUB_ROUTES.ADVANCED_DATA_CREATION
        : TESTBED_SUB_ROUTES.HISTORICAL_DATA_TESTING;

      const subRoute = isAdvancedDataCreation
        ? ADVANCED_DATA_CREATION_SUB_ROUTES.RESULT
        : HISTORICAL_DATA_TESTING_SUB_ROUTES.RESULT;

      const formattedRoute = `${baseRoute}/${testbedType}/${subRoute
        ?.replace(":categoryId", categoryId!)
        .replace(":policyId", policyId!)
        .replace(":fileId", fileId!)}`;

      navigate(formattedRoute);
    }
  }, [data]);

  return {
    mutate,
    isLoading,
    error,
    data,
  };
}
