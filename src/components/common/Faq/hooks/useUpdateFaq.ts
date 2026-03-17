import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import { getAllFaqKey, IResponseFaq } from "./useGetFaqs";

export const updateFaqKey = `/faq/update-faq`;
export const updateFaqEndpoint = `/faq/:id`;

async function updateFaq(payload: IResponseFaq) {
  const axios = getProtectedAxios();
  const endpoint =
    API_BASE_URL + `${updateFaqEndpoint.replace(":id", payload.id)}`;
  return axios.patch(endpoint, payload);
}

export default function useUpdateFaq() {
  const { mutate, isLoading } = useMutation(
    [updateFaqKey],
    (payload: IResponseFaq) => updateFaq(payload),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {
        queryClient.refetchQueries(getAllFaqKey);
      },
    }
  );
  return { mutate, isLoading };
}
