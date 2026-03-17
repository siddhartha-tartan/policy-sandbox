import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../auth";
import { IOption } from "../../../../../dashboards/Spoc/Assessment/pages/IndivisualAssesment/hooks/useGetAssesment";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";

export interface IAssesmentQuestion {
  selected_option?: string;
  correct_answer?: string;
  question: string;
  options: IOption[];
}

export interface IResult {
  name: string;
  total_marks: number;
  marks_received: number;
  questions: IAssesmentQuestion[];
}

export const getResultKey =
  "/assessment/{assessment_id}/user-response/{attempt_id}";

export default function useGetResult() {
  const { id, attemptId } = useParams();

  async function fetch() {
    const endpoint =
      API_BASE_URL +
      getResultKey
        .replace(`{assessment_id}`, id || "")
        .replace("{attempt_id}", attemptId || "");
    const axios = getProtectedAxios();
    return axios.get(endpoint).then(({ data }) => data?.data);
  }
  const [result, setResult] = useState<IResult | null>();
  const { data, isLoading } = useQuery([getResultKey], () => fetch(), {
    onError(err) {
      queryErrorHandler(err);
    },
    enabled: !!attemptId,
  });

  useEffect(() => {
    if (data) {
      setResult({
        name: data?.assessment_name,
        total_marks: data?.question_details?.length,
        marks_received: data?.score,
        questions: data?.question_details?.map((row: any) => {
          const correct_answer = row?.options?.find(
            (option: any) => option?.is_correct
          )?.id;
          return {
            selected_option: row?.selected_option_id,
            correct_answer: correct_answer,
            question: row?.question_text,
            options: row?.options?.map((col: any) => {
              return {
                label: col?.option_text,
                value: col?.id,
              };
            }),
          };
        }),
      });
    }
  }, [data]);

  return { data: result, isLoading };
}
