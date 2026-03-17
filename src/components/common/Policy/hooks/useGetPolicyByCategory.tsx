import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";

export interface PolicyItem {
  name: string;
  owner: string;
  creation_date: number;
  modified_date: number;
  is_archived: boolean;
  validity: string;
  status: string;
  id: string;
  loan_category_id: string;
  policy_file: {
    file_name: string;
    id: string;
    status: "Successful" | "Processing" | "Failed";
  };
}

export interface IPolicyByCategory {
  policy_count: number;
  data: PolicyItem[];
  totalPages: number;
}

export const getPoliciesByCategoryEndpoint = "/category/:categoryId/policy";

export default function useGetPolicyByCategory(
  category_id: string,
  status = ""
) {
  const [policies, setPolicies] = useState<IPolicyByCategory | null>(null);
  const [name, setName] = useState<string>("");
  const [page, setPage] = useState(1);
  const [policyManagers, setPolicyManagers] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [policyStatus, setPolicyStatus] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);

  async function fetchPoliciesByCategory(category_id: string) {
    const axios = getProtectedAxios();

    let queryParams: string[] = [];

    if (name) queryParams.push(`policy_name=${name}`);
    if (startDate) queryParams.push(`start_date=${startDate}`);
    if (endDate) queryParams.push(`end_date=${endDate}`);
    if (policyManagers?.length > 0) {
      policyManagers?.forEach((item) => {
        if (item) {
          queryParams.push(`policy_manager=${item}`);
        }
      });
    }
    if (policyStatus?.length > 0) {
      policyStatus?.forEach((item) => {
        if (item) {
          queryParams.push(`status=${item}`);
        }
      });
    }
    if (status !== "") {
      queryParams.push(`status=${status}`);
    }
    if (page !== undefined && page !== null)
      queryParams.push(`page_number=${page}`);
    queryParams.push(`page_size=${pageSize}`);

    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
    const endpoint =
      API_BASE_URL +
      `${getPoliciesByCategoryEndpoint?.replace(
        ":categoryId",
        category_id
      )}${queryString}`;
    return axios.get(endpoint).then(({ data }) => data?.data);
  }

  const { data, isLoading } = useQuery(
    [
      getPoliciesByCategoryEndpoint,
      category_id,
      page,
      name,
      policyManagers,
      startDate,
      endDate,
      policyStatus,
      pageSize,
    ],
    () => fetchPoliciesByCategory(category_id),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      enabled: !!category_id,
    }
  );

  useEffect(() => {
    const temp: PolicyItem[] = [];

    data?.data?.forEach((item: any) => {
      const successfulFiles = item?.policy_files?.filter(
        (file: any) => file.status === "Successful"
      );

      if (!successfulFiles || successfulFiles.length === 0) return;

      const latestSuccessfulFile = successfulFiles.reduce(
        (latest: any, current: any) =>
          current.version > latest.version ? current : latest,
        successfulFiles[0]
      );

      temp.push({
        name: item.policy_name,
        owner: item.created_by,
        creation_date: new Date(item.created_at).getTime(),
        modified_date: new Date(item.updated_at).getTime(),
        status: item.status,
        id: item.id,
        policy_file: latestSuccessfulFile,
        validity: item?.validity,
        is_archived: item?.is_archived,
        loan_category_id: item?.loan_category_id,
      });
    });

    setPolicies({
      data: temp,
      policy_count: data?.policy_count,
      totalPages: data?.total_pages,
    });
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [name, policyManagers, startDate, endDate, policyStatus]);

  return {
    data: policies,
    isLoading,
    page,
    setPage,
    name,
    setName,
    policyManagers,
    setPolicyManagers,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    policyStatus,
    setPolicyStatus,
    setPageSize,
  };
}
