import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import { StatusTypes } from "../../Status";

export interface IAllAssement {
  total: number;
  completed: number;
  pending: number;
  assesments: IAssesment[];
  total_pages: number;
}

export interface IAssesment {
  name: string;
  start_date: number;
  end_date: number;
  passing_score: number;
  participants_count: number;
  status: string;
  description: string;
  id: string;
  loanCategory: string;
}

export const getAllAssessmentKey = `/assessment`;
export const getAssesmentStats = `/assessment/count`;

export default function useGetAllAssesment() {
  const [assessment_name, setAssesmentName] = useState<string>("");
  const [status, setStatus] = useState<StatusTypes | string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState<IAllAssement | null>(null);

  const getAllAssessment = async () => {
    let queryParams: string[] = [];

    if (assessment_name)
      queryParams.push(
        `assessment_name=${encodeURIComponent(assessment_name)}`
      );
    if (status) queryParams.push(`status=${encodeURIComponent(status)}`);
    if (page !== undefined && page !== null)
      queryParams.push(`page_number=${page}`);
    if (pageSize !== undefined && pageSize !== null)
      queryParams.push(`page_size=${pageSize}`);

    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
    const endpoint = API_BASE_URL + `${getAllAssessmentKey}${queryString}`;
    const axios = getProtectedAxios();
    return axios.get(endpoint).then(({ data }) => data?.data);
  };

  async function getAllStats() {
    const axios = getProtectedAxios();
    const endpoint = API_BASE_URL + getAssesmentStats;
    return axios.get(endpoint).then(({ data }) => data?.data);
  }

  const { data: allAssesmentsData } = useQuery(
    [getAllAssessmentKey, assessment_name, status, page, pageSize],
    () => getAllAssessment(),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {},
    }
  );

  const { data: statsData } = useQuery(
    [getAssesmentStats],
    () => getAllStats(),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {},
    }
  );

  useEffect(() => {
    if (allAssesmentsData && statsData) {
      const assesments: IAssesment[] = allAssesmentsData?.data?.map(
        (row: any) => {
          return {
            name: row?.assessment_name,
            start_date: new Date(row?.start_date).getTime(),
            end_date: new Date(row?.end_date).getTime(),
            passing_score: row?.passing_score,
            participants_count: row?.participant_count,
            status: row?.status,
            description: row?.description,
            id: row?.id,
            loanCategory: "",
          };
        }
      );
      setData({
        total: statsData?.total_assessment,
        completed: statsData?.assessment_done,
        pending: statsData?.assessment_pending,
        total_pages: allAssesmentsData?.total_pages,
        assesments: assesments,
      });
    }
  }, [allAssesmentsData, statsData]);

  useEffect(() => {
    setPage(1);
  }, [status, assessment_name]);

  return {
    data,
    isLoading: !data,
    assessment_name,
    setAssesmentName,
    status,
    setStatus,
    page,
    setPage,
    pageSize,
    setPageSize,
  };
}
