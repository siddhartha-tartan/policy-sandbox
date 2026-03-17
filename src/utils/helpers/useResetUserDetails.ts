import { userStore } from "../../store/userStore";
import { UserType } from "../constants/constants";
const useResetUserDetails = () => {
  const {
    setName,
    setEmail,
    setId,
    setPhoneNumber,
    setUserType,
    setLoanCategories,
    setEditableLoanCategories,
    setEmpId,
    setHomeRoute,
    setOrganisationId,
    setOrganisationName,
  } = userStore.getState();
  const resetUserDetails = () => {
    setName("");
    setEmail("");
    setId("");
    setPhoneNumber("");
    setUserType("" as UserType);
    setLoanCategories([]);
    setEditableLoanCategories([]);
    setEmpId("");
    setHomeRoute("");
    setOrganisationId("");
    setOrganisationName("");
  };

  return resetUserDetails;
};

export default useResetUserDetails;
