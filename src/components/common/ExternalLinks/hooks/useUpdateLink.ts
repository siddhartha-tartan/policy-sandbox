import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import { getLinksKey, ILink } from "./useGetLinks";
import CustomToast from "../../CustomToast";

export const updateLink = `/links/:linkId`;

export default function useUpdateLink() {
  const { customToast } = CustomToast();
  const add = async (payload: ILink) => {
    const endpoint = API_BASE_URL + updateLink.replace(":linkId", payload.id);

    const axios = getProtectedAxios();
    return axios.put(endpoint, payload).then(({ data }) => data?.data);
  };
  const { mutate, isLoading } = useMutation(
    [updateLink],
    (payload: ILink) => add(payload),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {
        customToast("Link updated successfully.", "SUCCESS");
        queryClient.invalidateQueries(getLinksKey);
      },
    }
  );
  return { mutate, isLoading };
}
