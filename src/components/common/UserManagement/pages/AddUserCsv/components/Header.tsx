import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Feature,
  LOCAL_STORAGE_FEATURE_LIST_KEY,
} from "../../../../../../hooks/useGetFeatures";
import {
  BASE_MODULE_ROUTE,
  BASE_ROUTES,
  FeatureIdentifiers,
  UserType,
} from "../../../../../../utils/constants/constants";
import { deserializeJson } from "../../../../../../utils/helpers/deserializeJson";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import useAddUsers from "../../../hooks/useAddUsers";
import useUpdateBulkUsers from "../../../hooks/useUpdateBulkUsers";
import { USER_SUB_ROUTES } from "../../../utils/constant";
import { CsvParsedUser } from "../view";
import useGetUserType from "../../../../../../hooks/useGetUserType";
import { isNullOrUndefined } from "../../../../../../utils/helpers/isNullorUndefined";

export default function Header({
  users,
  isEdit = false,
}: {
  users: CsvParsedUser[];
  isEdit?: boolean;
}) {
  const navigate = useNavigate();
  const userType = useGetUserType();
  const successCallback = () =>
    navigate(
      `${BASE_ROUTES[userType]}/${BASE_MODULE_ROUTE.USER}/${USER_SUB_ROUTES.BASE}`
    );
  const { mutate: addBulkUsers, isLoading: isAddBulkUsersLoading } =
    useAddUsers(successCallback, true);
  const { mutate: updateBulkUsers, isLoading: isUpdateBulkUsersLoading } =
    useUpdateBulkUsers(successCallback, true);
  const featureList = deserializeJson(
    localStorage.getItem(LOCAL_STORAGE_FEATURE_LIST_KEY),
    {}
  );

  const featureIds = useMemo(
    () => ({
      [FeatureIdentifiers.POLYGPT]: featureList?.feature_list?.find(
        (feature: Feature) => feature?.name === FeatureIdentifiers.POLYGPT
      )?.id!,
      [FeatureIdentifiers.POLICY_COMPARISON]: featureList?.feature_list?.find(
        (feature: Feature) =>
          feature?.name === FeatureIdentifiers.POLICY_COMPARISON
      )?.id!,
      [FeatureIdentifiers.AI_ASSESSMENT]: featureList?.feature_list?.find(
        (feature: Feature) => feature?.name === FeatureIdentifiers.AI_ASSESSMENT
      )?.id!,
    }),
    [featureList?.feature_list]
  );

  const config = isEdit
    ? {
        title: "Modify Users in Bulk",
        description: "Easily modify user data using our CSV upload feature",
        ctaTile: "Modify Users",
      }
    : {
        title: "Add Users in Bulk",
        description: "Easily import user data using our CSV upload feature",
        ctaTile: "Add Users",
      };

  const handleSubmit = () => {
    const userData = users?.map((item) => {
      let features = [];

      if (!isNullOrUndefined(item?.["PolyGPT"]) && item?.["PolyGPT"]) {
        features.push(featureIds?.[FeatureIdentifiers?.POLYGPT]);
      }
      if (
        !isNullOrUndefined(item?.["PolicyComparison"]) &&
        item?.["PolicyComparison"]
      ) {
        features.push(featureIds?.[FeatureIdentifiers?.POLICY_COMPARISON]);
      }
      if (
        !isNullOrUndefined(item?.["AI_ASSESSMENT"]) &&
        item?.["AI_ASSESSMENT"]
      ) {
        features.push(featureIds?.[FeatureIdentifiers?.AI_ASSESSMENT]);
      }

      const loan_category_access =
        item?.user_type === UserType.ADMIN
          ? null
          : Array.from(item?.loan_category_id || [])?.map((category) => ({
              loan_category_id: category,
              access_type: (item?.user_type === UserType.SPOC
                ? "edit"
                : null) as "edit" | "view" | null,
            })) || null;

      const payload: Record<string, any> = {};

      if (item?.source_employee_id)
        payload.source_employee_id = item.source_employee_id;
      if (item?.name) payload.first_name = item.name;
      if (item?.email) payload.email = item.email;
      if (item?.phone_number) payload.phone_number = item.phone_number;
      if (item?.user_type) payload.user_type = item.user_type;

      if (loan_category_access && loan_category_access.length > 0) {
        payload.loan_category_access = loan_category_access;
      }

      if (features.length > 0) payload.feature_ids = features;

      if (item?.user_type === UserType.QUERY_STAFF_USER) {
        payload.query_permission = true;
      }

      if (isEdit && !isNullOrUndefined(item?.is_active)) {
        payload.is_active = item.is_active;
      }

      return payload;
    });

    if (isEdit) {
      //@ts-ignore
      updateBulkUsers({ users: userData });
    } else {
      //@ts-ignore
      addBulkUsers(userData);
    }
  };

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col gap-2">
        <CustomText stylearr={[20, 28, 500]} color={"#101828"}>
          {config.title}
        </CustomText>
        <CustomText stylearr={[12, 18, 400]} color={"#101828"}>
          {config.description}
        </CustomText>
      </div>

      <CustomButton
        variant="quaternary"
        className="w-[160px] h-[40px] text-sm rounded-[8px]"
        isDisabled={
          !users?.length || isAddBulkUsersLoading || isUpdateBulkUsersLoading
        }
        isLoading={isAddBulkUsersLoading || isUpdateBulkUsersLoading}
        onClick={handleSubmit}
      >
        {config.ctaTile}
      </CustomButton>
    </div>
  );
}
