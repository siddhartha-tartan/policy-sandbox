import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import CustomToast from "../../../../components/common/CustomToast";
import { getLoanCategoryKey } from "../../../../hooks/useGetLoanCategories";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";

export const addSubCategoryKey = "/subcategory";

interface ISubAddCategory {
  subcategory_type: string;
  parent_category_id: string;
}

async function add(payload: ISubAddCategory[]) {
  const axios = getProtectedAxios();
  const endpoint = API_BASE_URL + addSubCategoryKey;
  return axios.post(endpoint, payload);
}

export default function useAddSubCategory() {
  const { customToast } = CustomToast();
  const { mutate, isLoading } = useMutation(
    [addSubCategoryKey],
    (payload: ISubAddCategory[]) => add(payload),
    {
      onSuccess() {
        customToast("Sub-Category Added successfully.", "SUCCESS");
        queryClient.refetchQueries(getLoanCategoryKey);
      },
      onError: queryErrorHandler,
    }
  );
  return { mutate, isLoading };
}
