import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../auth";
import { API_BASE_URL } from "../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../utils/queryErrorHandler";

// TODO: Set to false when ready to use real API
const USE_MOCK_DATA = true;

interface Dataset {
  name: string;
  download_url: string;
}

export interface DbSource {
  label: string;
  value: string;
  datasets: Dataset[];
  disabled?: boolean;
  disabledReason?: string;
}

interface DbSourcesResponse {
  status_code: number;
  message: string;
  data: DbSource[];
}

const MOCK_DB_SOURCES: DbSource[] = [
  {
    label: "Loan Against Property",
    value: "lap",
    datasets: [],
  },
  {
    label: "Home Loan",
    value: "home_loan",
    datasets: [],
    disabled: true,
    disabledReason: "Coming Soon",
  },
];

const DB_SOURCES_KEY = "/agents/db-sources";

export default function useGetDbSources() {
  const fetchDbSources = async (): Promise<DbSource[]> => {
    // Return mock data if in mock mode
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      return MOCK_DB_SOURCES;
    }

    const axios = getProtectedAxios();
    const endpoint = API_BASE_URL + DB_SOURCES_KEY;
    const response = await axios.get<DbSourcesResponse>(endpoint);
    return response.data?.data || [];
  };

  return useQuery([DB_SOURCES_KEY], fetchDbSources, {
    onError: queryErrorHandler,
    retry: 0,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
