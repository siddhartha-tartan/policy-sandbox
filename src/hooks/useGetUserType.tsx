import { userStore } from "../store/userStore";
import { UserType } from "../utils/constants/constants";

export default function useGetUserType(): UserType {
  const { userType } = userStore();
  return userType;
}
