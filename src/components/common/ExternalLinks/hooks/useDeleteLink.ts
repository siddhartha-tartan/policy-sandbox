import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import { getLinksKey } from "./useGetLinks";
import CustomToast from "../../CustomToast";

export const deleteLink = `/links/:linkId`;

export default function useDeleteLink() {
  const { customToast } = CustomToast();
  const add = async (id: string) => {
    const endpoint = API_BASE_URL + deleteLink.replace(":linkId", id);

    const axios = getProtectedAxios();
    return axios.delete(endpoint);
  };
  const { mutate, isLoading } = useMutation(
    [deleteLink],
    (payload: { id: string }) => add(payload.id),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {
        customToast("Link deleted successfully.", "SUCCESS");
        queryClient.invalidateQueries(getLinksKey);
      },
    }
  );
  return { mutate, isLoading };
}
