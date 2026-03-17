import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../../../auth";
import { API_BASE_URL } from "../../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../../utils/queryErrorHandler";
import { getAssessmentResultKey } from "./useGetAssesmentResult";
import CustomToast from "../../../../../../components/common/CustomToast";
import { useParams } from "react-router-dom";
import { queryClient } from "../../../../../../ProviderWrapper";

export const sendReminderKey = "/assessment/:assessmentId/reminder/:userId";

export default function useSendReminder() {
  const { customToast } = CustomToast();
  const { id } = useParams();
  async function sendReminder(user_id: string) {
    const endpoint =
      API_BASE_URL +
      sendReminderKey
        .replace(":userId", user_id)
        .replace(":assessmentId", id ?? "");
    const axios = getProtectedAxios();
    return axios.post(endpoint);
  }

  const { mutate, isLoading } = useMutation(
    [sendReminderKey],
    ({ user_id }: { user_id: string }) => sendReminder(user_id),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {
        customToast("Assessment Reminder Sent Successfully", "SUCCESS");
        queryClient.invalidateQueries(getAssessmentResultKey);
      },
    }
  );
  return { mutate, isLoading };
}
