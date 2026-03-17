import { useMutation } from "react-query";
import { queryClient } from "../ProviderWrapper";
import { getProtectedAxios } from "../auth";
import CustomToast from "../components/common/CustomToast";
import { API_BASE_URL } from "../utils/constants/endpoints";
import { queryErrorHandler } from "../utils/queryErrorHandler";
import { getLoanCategoryKey, ISubCategory } from "./useGetLoanCategories";

export const UpdateCategoryKey = "/category/:categoryId";
export interface IUpdateCategory {
  id: string;
  category_type: string;
  subcategories: ISubCategory[];
  is_disabled: boolean;
}

async function updateCategory(payload: IUpdateCategory) {
  const axios = getProtectedAxios();
  const endpoint =
    API_BASE_URL + UpdateCategoryKey?.replace(":categoryId", payload?.id);
  return axios.patch(endpoint, payload);
}

export default function useUpdateCategory() {
  const { customToast } = CustomToast();
  const { mutate, isLoading } = useMutation(
    [UpdateCategoryKey],
    (payload: IUpdateCategory) => updateCategory(payload),
    {
      onError: queryErrorHandler,
      onSuccess() {
        customToast("Category updated successfully", "SUCCESS");
        queryClient.refetchQueries(getLoanCategoryKey);
      },
    }
  );
  return { mutate, isLoading };
}
