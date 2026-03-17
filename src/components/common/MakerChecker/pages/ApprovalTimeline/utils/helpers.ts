import { UserType } from "../../../../../../utils/constants/constants";
import { ApprovalStep } from "../../../../../Polycraft/pages/ViewPolicy/view";
import { getTimeAndMonth } from "../../../../../Polycraft/uitls/helper";
import { IApprovalTimeline } from "../hooks/useGetApprovalTimeline";

export const adaptTimelineResp = (
  inputData: IApprovalTimeline | null
): ApprovalStep[] => {
  const level0: ApprovalStep = {
    users: [
      {
        user_id: inputData?.maker?.user_id || "",
        user_name: inputData?.maker?.user_name || "",
        action_type: "",
        timestamp: "",
        comment: "",
        role: UserType.SPOC,
        employee_id: inputData?.maker?.employee_id || "",
      },
    ],
    timestamp: getTimeAndMonth(inputData?.created_at),
    status: "APPROVED",
    level: 0,
  };

  const workflowTimeline =
    inputData?.workflow_timeline?.map(
      (obj): ApprovalStep => ({
        users: obj?.approvers || [],
        timestamp: getTimeAndMonth(obj?.completion_time),
        status: obj?.status as ApprovalStep["status"],
        level: obj?.level,
      })
    ) || [];

  return [level0, ...workflowTimeline];
};
