import { useEffect } from "react";
import { MOCK_ENABLED_FEATURES } from "../mock/mockData";
import { userStore } from "../store/userStore";
import { getHomeRoute } from "../utils/helpers/getHomeRoute";
import useGetUserType from "./useGetUserType";

export const getFeaturesEndpoint = "/features/user-features";
export interface Feature {
  id?: string;
  name: string;
  is_enable: boolean;
}

interface GetFeaturesResponse {
  feature_list: Feature[];
}

export const LOCAL_STORAGE_FEATURE_LIST_KEY = "feature_list";

export default function useGetFeatures() {
  const { setHomeRoute, setEnabledFeature } = userStore();
  const userType = useGetUserType();

  const data: GetFeaturesResponse = {
    feature_list: MOCK_ENABLED_FEATURES,
  };

  useEffect(() => {
    if (data && userType) {
      setHomeRoute(getHomeRoute(data.feature_list, userType));
      const enabled = data.feature_list
        .filter((f) => f.is_enable)
        .map((f) => f.name);
      setEnabledFeature(enabled);
    }
  }, [userType]);

  return {
    isLoading: false,
    data,
  };
}
