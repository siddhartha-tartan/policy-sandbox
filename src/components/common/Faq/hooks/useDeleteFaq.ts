import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import { getAllFaqKey } from "./useGetFaqs";
export interface IDeleteFaq {
  id: string;
}

export const deleteFaqKey = `/faq/delete-faq`;
export const deleteFaqEndpoint = `/faq/:id`;

async function deleteFaq(payload: IDeleteFaq) {
  const axios = getProtectedAxios();
  const endpoint =
    API_BASE_URL + `${deleteFaqEndpoint.replace(":id", payload.id)}`;
  return axios.delete(endpoint);
}

export default function useDeleteFaq() {
  const { mutate, isLoading } = useMutation(
    [deleteFaqKey],
    (payload: IDeleteFaq) => deleteFaq(payload),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {
        queryClient.invalidateQueries(getAllFaqKey);
      },
    }
  );
  return { mutate, isLoading };
}
