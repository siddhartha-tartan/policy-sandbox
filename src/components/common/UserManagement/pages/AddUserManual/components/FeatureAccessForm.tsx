import { Switch } from "@chakra-ui/react";
import { useMemo } from "react";
import {
  Feature,
  LOCAL_STORAGE_FEATURE_LIST_KEY,
} from "../../../../../../hooks/useGetFeatures";
import { deserializeJson } from "../../../../../../utils/helpers/deserializeJson";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import { IAddUser } from "../../../hooks/useAddUsers";
import { featureConfig } from "../utils/config";

export type FeatureAccessData = Pick<IAddUser, "feature_ids">;

export default function FeatureAccessForm({
  data,
  setData,
}: {
  data: FeatureAccessData;
  setData: (e: FeatureAccessData) => void;
}) {
  const featureList = deserializeJson(
    localStorage.getItem(LOCAL_STORAGE_FEATURE_LIST_KEY),
    {},
  );

  const config = useMemo(() => {
    const allFeatures = featureList?.feature_list || [];
    const fullConfig = featureConfig(allFeatures);
    return fullConfig.filter((item) => {
      const matchingFeature = allFeatures.find(
        (f: Feature) => f.id === item.value,
      );
      return matchingFeature?.is_enable === true;
    });
  }, [featureList]);

  const handleFeatureToggle = (featureId: string) => {
    const currentFeatureIds = data?.feature_ids || [];

    const updatedFeatureIds = currentFeatureIds.includes(featureId)
      ? currentFeatureIds.filter((id) => id !== featureId)
      : [...currentFeatureIds, featureId];

    setData({ feature_ids: updatedFeatureIds });
  };

  return (
    <div className="flex flex-col gap-4">
      {config?.map((item) => (
        <div
          key={item.title}
          className="flex flex-row justify-between items-center"
        >
          <div className="flex flex-col">
            <CustomText stylearr={[14, 22, 500]} color={"#141414"}>
              {item.title}
            </CustomText>
            <CustomText stylearr={[12, 18, 400]} color={"#141414"}>
              {item.description}
            </CustomText>
          </div>
          <Switch
            colorScheme="blue"
            sx={{
              "& .chakra-switch__track[data-checked]": {
                backgroundColor: "#2F78EE",
              },
            }}
            isChecked={(data?.feature_ids || [])?.includes(item?.value)}
            onChange={() => handleFeatureToggle(item.value)}
          />
        </div>
      ))}
    </div>
  );
}
