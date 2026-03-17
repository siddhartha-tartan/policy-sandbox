import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../../auth";
import { API_BASE_URL } from "../../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../../utils/queryErrorHandler";
import { IUsers } from "./useGetAssesment";

export const getAssessmentResultKey = "/assessment/${assessment_id}/results";

export default function useGetAssessmentResult() {
  const { id } = useParams();
  const [assessment_name, setAssesmentName] = useState<string>("");
  const [assessmentStatus, setAssessmentStatus] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState<IUsers | null>(null);

  const getAssessmentResult = async () => {
    let queryParams: string[] = [];

    if (assessment_name)
      queryParams.push(`user_name=${encodeURIComponent(assessment_name)}`);
    if (assessmentStatus)
      queryParams.push(`status=${encodeURIComponent(assessmentStatus)}`);
    if (page !== undefined && page !== null)
      queryParams.push(`page_number=${page}`);
    if (pageSize !== undefined && pageSize !== null)
      queryParams.push(`page_size=${pageSize}`);

    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
    const endpoint =
      API_BASE_URL +
      `${getAssessmentResultKey.replace(
        "${assessment_id}",
        id || ""
      )}${queryString}`;
    const axios = getProtectedAxios();
    return axios.get(endpoint).then(({ data }) => data?.data);
  };

  const { data: resultData, isLoading } = useQuery(
    [
      getAssessmentResultKey,
      assessment_name,
      assessmentStatus,
      page,
      pageSize,
      id,
    ],
    () => getAssessmentResult(),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {},
    }
  );

  useEffect(() => {
    setPage(1);
  }, [assessmentStatus, assessment_name]);

  useEffect(() => {
    if (resultData) {
      setData({
        usersData: resultData?.data?.map((row: any) => {
          return {
            name: row?.user_name,
            date: row?.submission_date
              ? new Date(row?.submission_date).getTime()
              : "-",
            score: row?.score,
            attempted: row?.attempted,
            status: row?.status,
            id: row?.user_id,
          };
        }),
        totalPages: resultData?.total_pages,
      });
    }
  }, [resultData]);

  return {
    data,
    isLoading,
    assessment_name,
    setAssesmentName,
    assessmentStatus,
    setAssessmentStatus,
    page,
    setPage,
    pageSize,
    setPageSize,
  };
}
