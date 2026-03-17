import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import CustomToast from "../../../../components/common/CustomToast";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { getLoanCategoryKey } from "../../../../hooks/useGetLoanCategories";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";

export const addCategoryKey = "/category";

interface IAddCategory {
  category_type: string;
}

async function add(payload: IAddCategory) {
  const axios = getProtectedAxios();
  const endpoint = API_BASE_URL + addCategoryKey;
  return axios.post(endpoint, payload);
}

export default function useAddCategory() {
  const { customToast } = CustomToast();
  const { mutate, isLoading } = useMutation(
    [addCategoryKey],
    (payload: IAddCategory) => add(payload),
    {
      onSuccess() {
        customToast("Category Added successfully.", "SUCCESS");
        queryClient.refetchQueries(getLoanCategoryKey);
      },
      onError: queryErrorHandler,
    }
  );
  return { mutate, isLoading };
}
