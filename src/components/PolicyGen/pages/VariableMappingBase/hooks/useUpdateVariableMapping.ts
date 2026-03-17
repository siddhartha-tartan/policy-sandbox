import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../../auth";
import { queryClient } from "../../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";
import CustomToast from "../../../../common/CustomToast";
import { getDestinationVariableKey } from "./useGetDestinationVariable";
import { getVariableMappingKey } from "./useGetVariableMapping";

export const updateVariableMappingKey = `/bre-variables`;

export interface IUpdateVariable {
  id: string;
  destination_variable?: string | null;
  data_type?: string;
  description?: string;
  source_variable: string;
}

export default function useUpdateVariableMapping() {
  const { customToast } = CustomToast();
  async function update(payload: IUpdateVariable[]) {
    const axios = getProtectedAxios();
    const endpoint = API_BASE_URL + updateVariableMappingKey;
    return axios.patch(endpoint, payload);
  }
  const { mutate, isLoading } = useMutation(
    [updateVariableMappingKey],
    (payload: IUpdateVariable[]) => update(payload),
    {
      onError: queryErrorHandler,
      onSuccess() {
        customToast("Variable Mapping Updated Successfully!", "SUCCESS");
        queryClient.refetchQueries(getDestinationVariableKey);
        queryClient.refetchQueries(getVariableMappingKey);
      },
    }
  );
  return { mutate, isLoading };
}
