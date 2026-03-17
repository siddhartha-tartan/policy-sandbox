import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { StatusTypes } from "../../../../components/common/Status";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";

export interface IPastAssesments {
  attempt_id: string;
  name: string;
  start_date: number;
  end_date: number;
  submission_date: number;
  passing_score: number;
  your_result: number;
  status: StatusTypes;
  id: string;
}

export interface PAST_ASSESMENTS_RESPONSE {
  current_page: number;
  total_pages: number;
  page_size: number;
  data: IPastAssesments[];
  total: number;
}

export const getPastAssesmentKey = `/user/assessment`;
export default function useGetPastAssesments() {
  const [assessment_name, setAssesmentName] = useState<string>("");
  const [status, setStatus] = useState<StatusTypes | string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);
  const [loanCategoryId, setLoanCategoryId] = useState<string>("");

  async function fetch() {
    let queryParams: string[] = [];

    if (assessment_name)
      queryParams.push(
        `assessment_name=${encodeURIComponent(assessment_name)}`
      );
    if (loanCategoryId)
      queryParams.push(
        `loan_category_id=${encodeURIComponent(loanCategoryId)}`
      );
    if (status) queryParams.push(`status=${encodeURIComponent(status)}`);
    if (page !== undefined && page !== null)
      queryParams.push(`page_number=${page}`);
    if (pageSize !== undefined && pageSize !== null)
      queryParams.push(`page_size=${pageSize}`);

    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
    const endpoint = API_BASE_URL + `${getPastAssesmentKey}${queryString}`;
    const axios = getProtectedAxios();
    return axios.get(endpoint).then(({ data }) => data?.data);
  }

  const [assesments, setAssesmnents] =
    useState<PAST_ASSESMENTS_RESPONSE | null>(null);

  const { data, isLoading } = useQuery(
    [
      getPastAssesmentKey,
      assessment_name,
      status,
      page,
      pageSize,
      loanCategoryId,
    ],
    () => fetch(),
    {
      onError(err) {
        queryErrorHandler(err);
      },
    }
  );

  useEffect(() => {
    setPage(1);
  }, [status, assessment_name, loanCategoryId]);

  useEffect(() => {
    if (data) {
      setAssesmnents({
        current_page: data?.current_page,
        total_pages: data?.total_pages,
        page_size: data?.page_size,
        data: data?.data?.map((row: any) => {
          return {
            name: row?.assessment_name,
            start_date: row?.start_date,
            end_date: row?.end_date,
            submission_date: row?.submission_date,
            passing_score: row?.passing_score,
            your_result: row?.result,
            status: row?.status,
            id: row?.id,
            attempt_id: row?.attempt_id,
          };
        }),
        total: data?.total,
      });
    }
  }, [data]);

  return {
    data: assesments,
    isLoading,
    page,
    setPage,
    loanCategoryId,
    setLoanCategoryId,
    assessment_name,
    setAssesmentName,
    status,
    setStatus,
    setPageSize,
  };
}
