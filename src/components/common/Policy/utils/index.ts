import { MODIFY_POLICY_DETAILS } from "../../../../dashboards/Spoc/Policy/pages/ModifyPolicy/components/EditPolicyMode";
import { today } from "../AddUpdatePolicy";

export const isAddUpdatePolicyValid = (data: MODIFY_POLICY_DETAILS) => {
  return (
    data?.loan_category_id &&
    data?.name &&
    !data?.error &&
    (data?.file || data?.url) &&
    (!data?.validity || data?.validity >= today)
  );
};
