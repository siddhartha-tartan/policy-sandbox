import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../../../../store/userStore";
import { BASE_ROUTES } from "../../../../../utils/constants/constants";
import CustomToast from "../../../CustomToast";
import { MAKER_CHECKER_SUB_ROUTES } from "../../utils/constant";

export interface IApprovalAction {
  action_type: "APPROVE" | "REJECT";
  comments?: string;
  request_id: string;
}

export const approveRejectApprovalKey = `/approvals/action`;

export default function useApproveRejectApproval() {
  const navigate = useNavigate();
  const { customToast } = CustomToast();
  const { userType } = userStore();
  const [isLoading, setIsLoading] = useState(false);

  const mutate = (
    _payload: IApprovalAction,
    options?: { onSuccess?: () => void; onError?: (err: any) => void }
  ) => {
    setIsLoading(true);
    setTimeout(() => {
      customToast("Action submitted successfully.", "SUCCESS");
      setIsLoading(false);
      options?.onSuccess?.();
      navigate(
        `${BASE_ROUTES[userType]}/maker-checker/${MAKER_CHECKER_SUB_ROUTES.BASE}`
      );
    }, 500);
  };

  return { mutate, isLoading };
}
