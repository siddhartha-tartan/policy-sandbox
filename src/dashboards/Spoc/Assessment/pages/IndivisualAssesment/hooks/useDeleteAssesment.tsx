import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../../auth";
import {
  getAllAssessmentKey,
  getAssesmentStats,
} from "../../../../../../components/common/Assesment/hooks/useGetAllAssesment";
import { queryClient } from "../../../../../../ProviderWrapper";
import { userStore } from "../../../../../../store/userStore";
import { BASE_ROUTES } from "../../../../../../utils/constants/constants";
import { API_BASE_URL } from "../../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../../utils/queryErrorHandler";

export const deleteAssesmentKey = "/cancel-assessment/:assessment_id";
export default function useDeleteAssesment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userType } = userStore();
  async function delelteAssesment(assesmentId?: string) {
    const endpoint =
      API_BASE_URL +
      `${deleteAssesmentKey.replace(
        ":assessment_id",
        assesmentId || id || ""
      )}`;
    const axios = getProtectedAxios();
    return axios.patch(endpoint);
  }

  const { mutate, isLoading } = useMutation(
    [deleteAssesmentKey, id],
    ({ assesmentId = "" }: { assesmentId?: string }) =>
      delelteAssesment(assesmentId),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {
        queryClient.invalidateQueries(getAllAssessmentKey);
        queryClient.invalidateQueries(getAssesmentStats);
        navigate(`${BASE_ROUTES[userType]}/assessment`);
      },
    }
  );
  return { mutate, isLoading };
}
