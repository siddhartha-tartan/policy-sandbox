import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import { getAllFaqKey } from "./useGetFaqs";

export interface IAddFaq {
  query_text: string;
  answer_text: string;
  category_id: string;
}

export const addFaqKey = `/faq/add-faq`;
export const addFaqEndpoint = "/faq";

export default function useAddFaq() {
  const add = async (payload: IAddFaq[]) => {
    const endpoint = API_BASE_URL + addFaqEndpoint;

    const axios = getProtectedAxios();
    return axios.post(endpoint, payload).then(({ data }) => data?.data);
  };

  const { mutate, isLoading } = useMutation(
    [addFaqKey],
    (payload: IAddFaq[]) => add(payload),
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
