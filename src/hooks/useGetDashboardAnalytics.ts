import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getProtectedAxios } from "../auth";
import { userStore } from "../store/userStore";
import { API_BASE_URL } from "../utils/constants/endpoints";
import { queryErrorHandler } from "../utils/queryErrorHandler";

export interface IUserAnalytics {
  total_policy: number;
  total_assessments_completed: number;
  total_assessments_pending: number;
  assessment_diff: {
    live_assessments: number;
    completed_assessments: number;
  };
}

export const getAnalyticsEndpoint = "/analytics";

export default function useGetDashboardAnalytics() {
  const { userType } = userStore();
  const [productId, setProductId] = useState<string>("");
  const [analytics, setAnalytics] = useState<any>(null);
  async function fetch() {
    let queryParams: string[] = [];

    if (productId !== "")
      queryParams.push(`policy_category_id=${encodeURIComponent(productId)}`);

    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
    const axios = getProtectedAxios();
    const endpoint = API_BASE_URL + getAnalyticsEndpoint + queryString;
    return axios.get(endpoint).then(({ data }) => data?.data);
  }

  const { data, isLoading } = useQuery(
    [getAnalyticsEndpoint, userType, productId],
    () => fetch(),
    {
      onSuccess() {},
      onError(err) {
        queryErrorHandler(err);
      },
    }
  );

  useEffect(() => {
    if (data) {
      setAnalytics(data);
    }
  }, [data]);

  return {
    data: analytics,
    isLoading,
    setProductId,
    productId,
  };
}
