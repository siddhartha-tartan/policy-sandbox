import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import { getLinksKey } from "./useGetLinks";
import CustomToast from "../../CustomToast";

export interface IAddLink {
  link_name: string;
  description: string;
  url: string;
  is_active: boolean;
  edit?: boolean;
}

export const addLinkKey = `/links`;

export default function useAddLink() {
  const { customToast } = CustomToast();
  const add = async (payload: IAddLink) => {
    const endpoint = API_BASE_URL + addLinkKey;

    const axios = getProtectedAxios();
    return axios.post(endpoint, payload).then(({ data }) => data?.data);
  };
  const { mutate, isLoading } = useMutation(
    [addLinkKey],
    (payload: IAddLink) => add(payload),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {
        customToast("Link added successfully.", "SUCCESS");
        queryClient.invalidateQueries(getLinksKey);
      },
    }
  );
  return { mutate, isLoading };
}
