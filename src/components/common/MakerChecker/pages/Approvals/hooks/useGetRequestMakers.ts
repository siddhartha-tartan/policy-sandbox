import { MOCK_REQUEST_MAKERS } from "../../../../../../mock/mockData";

export const getRequestMakersKey = `/approvals/request-makers`;

export default function useGetRequestMakers() {
  return {
    data: MOCK_REQUEST_MAKERS.map((m) => ({
      user_id: m.id,
      name: m.name,
    })),
    isLoading: false,
  };
}
