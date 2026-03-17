import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { getAnalyticsEndpoint } from "../../../../hooks/useGetDashboardAnalytics";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import { getAllAssessmentKey, getAssesmentStats } from "./useGetAllAssesment";

export interface USER_MAPPING_ASSESMENT {
  loan_category_id: string;
  assessment_id: string;
  user_id: string[];
  all_selected: boolean;
}

async function update(payload: USER_MAPPING_ASSESMENT) {
  const axios = getProtectedAxios();
  const endpoint =
    API_BASE_URL +
    addUsersAssesment
      .replace(":category_id", payload.loan_category_id)
      .replace(":assessment_id", payload.assessment_id);
  return axios.post(endpoint, payload);
}

export const addUsersAssesment =
  "/:category_id/assessment-user-mapping/:assessment_id";
export default function useAddUsersAssesment() {
  const { mutate, isLoading } = useMutation(
    [addUsersAssesment],
    (payload: USER_MAPPING_ASSESMENT) => update(payload),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {
        queryClient.invalidateQueries(getAnalyticsEndpoint);
        queryClient.invalidateQueries(getAllAssessmentKey);
        queryClient.invalidateQueries(getAssesmentStats);
      },
    }
  );
  return { mutate, isLoading };
}
