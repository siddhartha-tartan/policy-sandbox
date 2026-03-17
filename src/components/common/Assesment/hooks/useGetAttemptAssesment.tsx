import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { IAssesment } from "../../../../components/common/Assesment/hooks/useGetAllAssesment";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";

async function fetch() {
  const axios = getProtectedAxios();
  const endpoint = API_BASE_URL + pendingAssesmentkey;
  return axios.get(endpoint).then(({ data }) => data.data);
}

export const pendingAssesmentkey = "/user/assessment/pending";
export default function useGetAttemptAssesment() {
  const [assesments, setAssesments] = useState<IAssesment[] | null>(null);
  const { data, isLoading } = useQuery([pendingAssesmentkey], () => fetch(), {
    onError(err) {
      queryErrorHandler(err);
    },
    onSuccess() {},
  });

  useEffect(() => {
    if (data) {
      setAssesments(
        data?.map((row: any) => {
          return {
            name: row?.assessment_name,
            start_date: new Date(row?.start_date).getTime(),
            end_date: new Date(row?.end_date).getTime(),
            passing_score: row?.passing_score,
            participants_count: row?.total,
            status: row?.status,
            id: row?.id,
            description: "",
            loanCategory: "",
          };
        })
      );
    }
  }, [data]);

  return { data: assesments, isLoading };
}
