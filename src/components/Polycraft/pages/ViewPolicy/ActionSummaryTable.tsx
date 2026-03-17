import { Text } from "@chakra-ui/react";
import { BsDot } from "react-icons/bs";
import { userStore } from "../../../../store/userStore";
import { formatDateTimeString } from "../../../../utils/helpers/formatDate";
import { getLoanCategoryTypeById } from "../../../../utils/helpers/loanCategoryHelpers";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import { IApprovalTimeline } from "../../../common/MakerChecker/pages/ApprovalTimeline/hooks/useGetApprovalTimeline";

const StatusMapper: Record<string, string> = {
  HIGH: "#E64A19",
  MEDIUM: "#F9A825",
  LOW: "#4CAF50",
};

const ActionSummaryTable = ({ data }: { data: IApprovalTimeline }) => {
  const rawStatus =
    data?.workflow_timeline?.[data?.current_level - 1]?.status || "";
  const formattedStatus = rawStatus
    .replace(/_/g, " ") // Replace underscores with spaces
    .toLowerCase() // Convert entire string to lowercase
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letter of each word

  const { loanCategories } = userStore();
  const config = [
    {
      label: "Action Type",
      value:
        data?.entity_data?.event_type === "NEW_REQUEST"
          ? "Policy Upload"
          : "Policy Modification",
    },
    {
      label: "Category",
      value: getLoanCategoryTypeById(
        data?.entity_data?.category_id || "",
        loanCategories
      ),
    },
    {
      label: "Priority",
      comp: (
        <div
          className={`flex flex-row gap-[2px] items-center text-sm font-semibold`}
          style={{
            color: StatusMapper[data?.priority.toUpperCase()] || "#4CAF50",
          }}
        >
          <BsDot fontSize={"20px"} />
          <Text>
            {data?.priority?.charAt(0).toUpperCase() +
              data?.priority?.slice(1).toLowerCase()}
          </Text>
        </div>
      ),
    },
    {
      label: "Last Action Taken On",
      value: formatDateTimeString(new Date(data?.created_at)),
    },
    {
      label: "Review Progress",
      comp: (
        <div
          className={`flex flex-row gap-[2px] items-center text-sm font-semibold`}
        >
          <BsDot fontSize={"20px"} />
          <Text>{`${formattedStatus} at L${
            data?.current_level || "NaN"
          }`}</Text>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <CustomText stylearr={[18, 24, 600]} color={"#455A64"}>
        Action Summary
      </CustomText>
      <div className="flex flex-row justify-between">
        {config?.map((item, id) => (
          <div
            className={`flex flex-col gap-2 ${
              id !== config.length - 1 && "mr-6"
            }`}
          >
            <CustomText stylearr={[12, 16, 400]} color={"#455A64"}>
              {item.label}
            </CustomText>
            {item?.comp ? (
              item.comp
            ) : (
              <CustomText stylearr={[13, 18, 600]} color={"#263238"}>
                {item?.value}
              </CustomText>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionSummaryTable;
