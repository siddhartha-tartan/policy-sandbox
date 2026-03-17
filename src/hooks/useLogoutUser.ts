import { useNavigate } from "react-router-dom";
import { queryClient } from "../ProviderWrapper";
import useResetAuthStore from "../utils/helpers/useResetAuthStore";
import useResetUserDetails from "../utils/helpers/useResetUserDetails";

export const logoutUserKey = "/logout?refresh_token=:refreshToken";

export default function useLogoutUser() {
  const resetAuthStore = useResetAuthStore();
  const resetUserDetails = useResetUserDetails();
  const navigate = useNavigate();

  const mutate = () => {
    queryClient.clear();
    resetAuthStore();
    resetUserDetails();
    navigate("/login");
  };

  return { mutate, isLoading: false };
}
