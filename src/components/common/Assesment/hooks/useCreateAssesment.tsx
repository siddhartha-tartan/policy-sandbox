import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import { getAllAssessmentKey, getAssesmentStats } from "./useGetAllAssesment";

export interface CREATE_ASSESMENT {
  assessment_name: string;
  start_date: string;
  end_date: string;
  submission_date: string;
  passing_score: number;
  description: string;
  loan_category_id: string;
}

async function createAssesment(payload: CREATE_ASSESMENT) {
  const endpoint =
    API_BASE_URL +
    createAssesmentKey.replace(":loan_category_id", payload.loan_category_id);
  const axios = getProtectedAxios();
  return axios.post(endpoint, payload).then(({ data }) => data?.data);
}

export const createAssesmentKey = `/:loan_category_id/assessment`;
export default function useCreateAssesment() {
  const { mutate, isLoading } = useMutation(
    [createAssesmentKey],
    (payload: CREATE_ASSESMENT) => createAssesment(payload),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {
        queryClient.invalidateQueries(getAllAssessmentKey);
        queryClient.invalidateQueries(getAssesmentStats);
      },
    }
  );
  return { mutate, isLoading };
}
