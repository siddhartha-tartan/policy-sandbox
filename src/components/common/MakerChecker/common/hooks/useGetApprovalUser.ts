import { useState } from "react";
import { MOCK_APPROVAL_USERS } from "../../../../../mock/mockData";
import { UserType } from "../../../../../utils/constants/constants";
import { IAddWorkFlowUser } from "../../pages/WorkFlow/hooks/useAddWorkFlow";

export const getApprovalUserKey = `/users/:categoryId/user_types`;

export default function useGetApprovalUsers(categoryId: string) {
  const [userRoles, setUserRoles] = useState<Set<string>>(
    new Set([UserType.ADMIN, UserType.SPOC])
  );

  const raw = MOCK_APPROVAL_USERS[categoryId] || MOCK_APPROVAL_USERS["cat-001"] || [];
  const users: IAddWorkFlowUser[] = raw.map((u) => ({
    user_id: u.id,
    name: `${u.first_name} ${u.last_name}`,
    employee_id: "EMP-001",
    role: u.user_type,
  }));

  return {
    data: users,
    isLoading: false,
    userRoles,
    setUserRoles,
  };
}
