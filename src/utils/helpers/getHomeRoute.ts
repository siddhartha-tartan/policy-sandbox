import { Feature } from "../../hooks/useGetFeatures";
import {
  BASE_ROUTES,
  FeatureKeyToBaseRouteMapper,
  FeatureIdentifiers,
  UserType,
} from "../constants/constants";

export type FeatureKey = keyof typeof FeatureKeyToBaseRouteMapper;

export function getHomeRoute(
  featureList: Feature[],
  userType: UserType
): string {
  const firstEnabledFeature = featureList?.find(
    (item) => item?.is_enable === true
  );

  let enabledFeature = "home";
  if (firstEnabledFeature?.name) {
    // Use values directly from FeatureIdentifiers
    const featureValues = Object.values(FeatureIdentifiers);
    if (featureValues.includes(firstEnabledFeature.name)) {
      // Find the key for this feature name
      const featureEntry = Object.entries(FeatureIdentifiers).find(
        ([_, value]) => value === firstEnabledFeature.name
      );

      if (featureEntry) {
        const [key] = featureEntry;
        const featureIdentifier =
          FeatureIdentifiers[key as keyof typeof FeatureIdentifiers];
        enabledFeature =
          FeatureKeyToBaseRouteMapper[featureIdentifier as FeatureKey];
      }
    }
  }

  return `${BASE_ROUTES[userType]}/${enabledFeature}`;
}
