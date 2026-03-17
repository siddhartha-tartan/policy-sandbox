import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import CustomToast from "../../../../components/common/CustomToast";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import { getSpocAnalyticsKey } from "./useGetAnalytics";

export const sendReminderAllKey = "/assessment/:assessmentId/remind-all";

export default function useRemindAllUsersAssessment() {
  const { customToast } = CustomToast();
  async function sendReminder(assessmentId: string) {
    const endpoint =
      API_BASE_URL + sendReminderAllKey?.replace(":assessmentId", assessmentId);
    const axios = getProtectedAxios();
    return axios.post(endpoint);
  }

  const { mutate, isLoading } = useMutation(
    [sendReminderAllKey],
    ({ assessmentId }: { assessmentId: string }) => sendReminder(assessmentId),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {
        customToast("Assessment Reminder Sent Successfully", "SUCCESS");
        queryClient.invalidateQueries(getSpocAnalyticsKey);
      },
    }
  );
  return { mutate, isLoading };
}
