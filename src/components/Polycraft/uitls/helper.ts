import { MODIFY_POLICY_DETAILS } from "../../../dashboards/Spoc/Policy/pages/ModifyPolicy/components/EditPolicyMode";

export const isAddUpdatePolicyValid = (data: MODIFY_POLICY_DETAILS) => {
  return (
    data?.loan_category_id &&
    data?.name &&
    data?.description &&
    !data?.error &&
    (data?.file || data?.url)
  );
};

export const getTimeAndMonth = (val?: any) => {
  let createdAt;
  if (val) {
    createdAt = new Date(val);
  } else {
    createdAt = new Date();
  }

  // Format the time as "HH:mm, DD MMM"
  const hours = createdAt.getHours().toString().padStart(2, "0"); // Add leading zero if necessary
  const minutes = createdAt.getMinutes().toString().padStart(2, "0"); // Add leading zero if necessary
  const day = createdAt.getDate().toString().padStart(2, "0");
  const month = createdAt.toLocaleString("default", { month: "long" }); // Get full month name (e.g., "July")
  return `${hours}:${minutes}, ${day} ${month}`; // Format time;
};
