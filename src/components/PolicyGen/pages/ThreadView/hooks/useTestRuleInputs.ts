import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../../auth";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";

export const validateRulesKey = `/:requestId/rules-details`;

interface IRequest {
  borrower_pan?: string;
  co_borrower_pan?: string;
  gst?: string;
  required_fields: string[];
}

export interface ITestRulesResult {
  label: string;
  value: string;
  rule: string;
}

export interface IResponse {
  status_code: string;
  data: ITestRulesResult[];
  error?: string;
}
export default function useTestRuleInputs() {
  const requestId = new URLSearchParams(location.search).get("code_request_id");
  const validateRules = async (payload: IRequest) => {
    const endpoint =
      API_BASE_URL + validateRulesKey.replace(":requestId", requestId || "");
    const axios = getProtectedAxios();

    return axios
      .post(endpoint, payload)
      .then(({ data }) => data?.data as ITestRulesResult[]);
  };

  const { mutate, isLoading, data } = useMutation(
    [validateRulesKey],
    (payload: IRequest) => validateRules(payload),
    {
      onError: queryErrorHandler,
    }
  );
  return { mutate, isLoading, data: data || [] };
}
