import { useEffect } from "react";
import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../auth";
import EventBus from "../../../EventBus";
import { API_BASE_URL } from "../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../utils/queryErrorHandler";
import CustomToast from "../../common/CustomToast";
const submitFeedback = "/user_feedback";
export const EVENT_SUBMIT_FEEDBACK = "EVENT_SUBMIT_FEEDBACK";
async function submit(payload: any) {
  const axios = getProtectedAxios();
  const endpoint = API_BASE_URL + submitFeedback;
  return axios.post(endpoint, payload).then(({ data }) => data?.data);
}

export default function useFeedback() {
  const { customToast } = CustomToast();
  const { mutate, isLoading } = useMutation(
    [submitFeedback],
    (payload) => submit(payload),
    {
      onError: queryErrorHandler,
      onSuccess() {
        customToast("Feedback submitted successfully", "SUCCESS");
      },
    }
  );

  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_SUBMIT_FEEDBACK, mutate);
    return () => EventBus.getInstance().removeListener(mutate);
  }, []);

  return { mutate, isLoading };
}
