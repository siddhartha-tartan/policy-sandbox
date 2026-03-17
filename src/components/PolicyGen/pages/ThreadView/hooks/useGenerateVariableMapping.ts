import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../auth";
import EventBus from "../../../../../EventBus";
import useGetUserType from "../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../utils/constants/constants";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";
import { POLICYGEN_SUB_ROUTES } from "../../../../common/PolicyGen/utils/constants";
import { PolicyGenDataResponse } from "../../../hooks/useGetPolicyGenData";
import usePolicyGenPolling from "../../../hooks/usePolicyGenPolling";
import {
  EVENT_CLOSE_GENERATE_VARIABLE_MAPPING,
  EVENT_OPEN_GENERATE_VARIABLE_MAPPING,
} from "../components/Rules/GenerateVariableMappingModal";
import { useEffect } from "react";

export const generateVariableMappingKey = `/agents/keys-mapper/files/:fileId`;

export default function useGenerateVariableMapping() {
  const { categoryId, policyId, fileId } = useParams<{
    categoryId: string;
    policyId: string;
    fileId: string;
  }>();
  const { mutate: startPolling } = usePolicyGenPolling();
  const navigate = useNavigate();
  const userType = useGetUserType();

  const generate = async (): Promise<PolicyGenDataResponse> => {
    let endpoint = `${API_BASE_URL}${generateVariableMappingKey.replace(
      ":fileId",
      fileId!
    )}`;
    const axios = getProtectedAxios();
    return axios.post(endpoint).then(({ data }) => data?.data);
  };

  const { mutate, data, error, isLoading } = useMutation(generate, {
    onError: queryErrorHandler,
  });

  useEffect(() => {
    const requestId = data?.id;
    if (requestId) {
      EventBus.getInstance().fireEvent(EVENT_OPEN_GENERATE_VARIABLE_MAPPING);
      startPolling(
        { requestId: requestId },
        {
          onSuccess() {
            EventBus.getInstance().fireEvent(
              EVENT_CLOSE_GENERATE_VARIABLE_MAPPING
            );

            setTimeout(() => {
              navigate(
                `${
                  BASE_ROUTES[userType]
                }/policygen/${POLICYGEN_SUB_ROUTES.VARIABLE_MAPPING_FILE.replace(
                  ":categoryId",
                  categoryId!
                )
                  .replace(":policyId", policyId!)
                  .replace(":fileId", fileId!)}`
              );
            }, 300);
          },
        }
      );
    }
  }, [data]);

  return {
    mutate,
    data,
    error,
    isLoading,
  };
}
