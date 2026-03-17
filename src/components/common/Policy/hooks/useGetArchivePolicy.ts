import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { userStore } from "../../../../store/userStore";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";

export interface ArchivePolicyItem {
  name: string;
  category_id: string;
  category_name: string;
  archive_date: number;
  status: string;
  id: string;
}

export interface IPolicyArchive {
  policy_count: number;
  data: ArchivePolicyItem[];
  totalPages: number;
}

export const getArchivePolicyEndpoint = "/policy/archived";

export default function useGetArchivePolicy() {
  const [policies, setPolicies] = useState<IPolicyArchive | null>(null);
  const [name, setName] = useState<string>("");
  const [productCategory, setProductCategory] = useState<string>("");
  const [page, setPage] = useState(1);
  const { loanCategories } = userStore();

  async function archivePolicy() {
    let queryParams: string[] = [];

    if (name) queryParams.push(`search=${name}`);
    if (page !== undefined && page !== null)
      queryParams.push(`page_number=${page}`);
    if (productCategory) queryParams.push(`loan_category=${productCategory}`);
    queryParams.push(`page_size=${10}`);

    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
    const endpoint = API_BASE_URL + `${getArchivePolicyEndpoint}${queryString}`;
    const axios = getProtectedAxios();
    return axios.get(endpoint).then(({ data }) => data?.data);
  }

  const { data, isLoading } = useQuery(
    [getArchivePolicyEndpoint, page, name, productCategory],
    archivePolicy,
    {
      onError(err) {
        queryErrorHandler(err);
      },
      retry: 1,
    }
  );

  useEffect(() => {
    const list: ArchivePolicyItem[] = [];

    data?.data?.forEach((item: any) => {
      list.push({
        name: item?.policy_name,
        category_id: item?.loan_category_id,
        archive_date: new Date(item.updated_at).getTime(),
        category_name:
          loanCategories?.find(
            (categories) => categories?.id === item?.loan_category_id
          )?.category_type || "",
        status: item?.status,
        id: item?.id,
      });
    });

    setPolicies({
      data: list,
      policy_count: data?.policy_count,
      totalPages: data?.total_pages,
    });
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [name, productCategory]);

  return {
    data: policies,
    isLoading,
    page,
    setPage,
    name,
    setName,
    productCategory,
    setProductCategory,
  };
}
