import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";

export interface IRecentAssessment {
  id: string;
  assessment_name: string;
  loan_category_id: string;
  start_date: string;
  end_date: string;
  total_participant: number;
  participant_attempted: number;
}

export interface IPendingQuery {
  id: string;
  loan_category_id: string;
  created_by: string;
  last_message_at: string;
  loan_category_name: string;
}

export interface IAssessmentReminder {
  id: string;
  assessment_name: string;
  loan_category_id: string;
  start_date: string;
  end_date: string;
  last_notified_on: string | null;
}

export interface IExpiredPolicy {
  id: string;
  loan_category_id: string;
  validity: string;
  policy_name: string;
}

export interface IAnalytics {
  spoc_data: {
    active_policy: number;
    active_users: number;
    passing_percentage: number;
    assessment_reminder: IAssessmentReminder[];
    recent_assessment: IRecentAssessment[];
    pending_queries: IPendingQuery[];
    expired_policies: IExpiredPolicy[];
  };
}

export const getSpocAnalyticsEndpoint = "/analytics";
export const getSpocAnalyticsKey = "/analytics/spoc";

export default function useGetAnalytics() {
  const [userCategoryId, setUserCategoryId] = useState<string>("");
  const [policyCategoryId, setPolicyCategoryId] = useState<string>("");
  const [analytics, setAnalytics] = useState<IAnalytics | null>(null);
  async function fetch(): Promise<IAnalytics> {
    const axios = getProtectedAxios();
    let queryParams: string[] = [];

    if (userCategoryId)
      queryParams.push(
        `user_category_id=${encodeURIComponent(userCategoryId)}`
      );
    if (policyCategoryId)
      queryParams.push(
        `policy_category_id=${encodeURIComponent(policyCategoryId)}`
      );
    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
    const endpoint = API_BASE_URL + `${getSpocAnalyticsEndpoint}${queryString}`;
    return axios.get(endpoint).then(({ data }) => data?.data);
  }

  const { data, isLoading } = useQuery(
    [getSpocAnalyticsKey, userCategoryId, policyCategoryId],
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
    userCategoryId,
    policyCategoryId,
    setUserCategoryId,
    setPolicyCategoryId,
  };
}
