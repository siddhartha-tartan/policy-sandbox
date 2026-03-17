import axios from "axios";
import { useMutation } from "react-query";
import EventBus from "../EventBus";
import { EVENT_OPEN_CHANGE_PASS_MODAL } from "../components/common/ChangePassModal";
import { userStore } from "../store/userStore";
import { UserType } from "../utils/constants/constants";
import { API_BASE_URL } from "../utils/constants/endpoints";
import { queryErrorHandler } from "../utils/queryErrorHandler";

export const loginRoleKey = "/login";

export interface LOGIN {
  email?: string;
  phone_number?: string;
  secret?: string;
}

export interface LOGIN_RESPONSE {
  access_token: string;
  refresh_token: string;
  user_type: UserType;
}

async function login(payload: LOGIN): Promise<LOGIN_RESPONSE> {
  const endpoint = API_BASE_URL + loginRoleKey;
  const response = await axios.post(endpoint, payload);
  return response.data?.data;
}

export default function useLogin() {
  const { setUserType } = userStore();

  const { mutate, isLoading } = useMutation(
    (payload: LOGIN) => login(payload),
    {
      onError: (err: any) => {
        queryErrorHandler(err?.response?.data?.message);
      },
      onSuccess: (successData: LOGIN_RESPONSE) => {
        if (successData) {
          localStorage.setItem("accessToken", successData.access_token);
          localStorage.setItem("refreshToken", successData.refresh_token);
          setUserType(successData.user_type);
          //@ts-ignore
          if (!successData?.has_logged_in) {
            setTimeout(() => {
              EventBus.getInstance().fireEvent(EVENT_OPEN_CHANGE_PASS_MODAL);
            }, 0);
          }
        }
      },
    }
  );

  return { mutate, isLoading };
}
