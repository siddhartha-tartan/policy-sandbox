import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../auth";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";

export interface UPDATE_ASSESMENT {
  assessment_name?: string;
  start_date?: string;
  end_date?: string;
  submission_date?: string;
  passing_score?: number;
  description?: string;
  loan_category_id?: string;
  attempts_allowed?: number;
  is_deleted?: boolean;
  id: string;
}

export const updateAssesmentKey = `/assessment/:assessment_id`;
export default function useUpdateAssesment() {
  const { id } = useParams<{ id: string }>();
  async function updateAssesment(payload: UPDATE_ASSESMENT) {
    const endpoint =
      API_BASE_URL + updateAssesmentKey.replace(":assessment_id", id || "");
    const axios = getProtectedAxios();
    return axios.patch(endpoint, payload);
  }

  const { mutate, isLoading } = useMutation(
    [updateAssesmentKey],
    (payload: UPDATE_ASSESMENT) => updateAssesment(payload),
    {
      onError(err) {
        queryErrorHandler(err);
      },
    }
  );
  return { mutate, isLoading };
}
