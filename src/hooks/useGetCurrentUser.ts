import { useEffect } from "react";
import { MOCK_USER } from "../mock/mockData";
import { userStore } from "../store/userStore";

export const getCurrentUserEndpoint = "/current-user";
export const getCurrentUserKey = "/current-user/get";

export default function useGetCurrentUser() {
  const {
    setName,
    setEmail,
    setPhoneNumber,
    setId,
    setEmpId,
    setSoruceEmployeeId,
    setOrganisationId,
    setOrganisationName,
  } = userStore();

  useEffect(() => {
    setName(MOCK_USER.first_name);
    setEmail(MOCK_USER.email);
    setPhoneNumber(MOCK_USER.phone_number);
    setId(MOCK_USER.id);
    setEmpId(MOCK_USER.source_employee_id);
    setSoruceEmployeeId(MOCK_USER.source_employee_id);
    setOrganisationId(MOCK_USER.organization_id);
    setOrganisationName(MOCK_USER.organization_name);
  }, []);

  return {
    isLoading: false,
  };
}
