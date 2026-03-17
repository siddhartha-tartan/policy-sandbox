import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetUserType from "../../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../../utils/constants/constants";
import CustomToast from "../../../../CustomToast";
import { MAKER_CHECKER_SUB_ROUTES } from "../../../utils/constant";
import { WORKFLOW_SUB_ROUTES } from "../constant";

export enum ApprovalType {
  ALL = "ALL",
  ONE = "ANY",
  N = "N_OF_M",
}

export interface IAddWorkFlowUser {
  user_id: string;
  name: string;
  employee_id: string;
  role: string;
}

export interface IWorkFlowLevel {
  level_number: number;
  approval_type: string;
  required_approvals: number;
  users: IAddWorkFlowUser[];
}

export interface IAddWorkFlow {
  name: string;
  module_id: string[];
  entity_types: string[];
  levels: IWorkFlowLevel[];
}

export const addWorkFlowKey = `/workflows`;

export default function useAddWorkFlow() {
  const { customToast } = CustomToast();
  const userType = useGetUserType();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const mutate = (_payload: IAddWorkFlow) => {
    setIsLoading(true);
    setTimeout(() => {
      customToast("Workflow created successfully.", "SUCCESS");
      setIsLoading(false);
      navigate(
        `${BASE_ROUTES[userType]}/maker-checker/${MAKER_CHECKER_SUB_ROUTES.WORKFLOW}/${WORKFLOW_SUB_ROUTES.BASE}`
      );
    }, 500);
  };

  return { mutate, isLoading };
}
