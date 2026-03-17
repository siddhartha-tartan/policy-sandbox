import { MOCK_POLICY_MANAGERS } from "../mock/mockData";

export interface ISpocUser {
  id: string;
  user_name: string;
}

export const getPolicyManagerByCategoryKey = "/spoc";

export default function useGetPolicyManagerByCategory(_categoryId?: string) {
  const users: ISpocUser[] = MOCK_POLICY_MANAGERS.map((m) => ({
    id: m.id,
    user_name: `${m.first_name} ${m.last_name}`,
  }));

  return {
    data: users,
    isLoading: false,
  };
}
