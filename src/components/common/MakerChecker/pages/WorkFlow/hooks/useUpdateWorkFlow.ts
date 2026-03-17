import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetUserType from "../../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../../utils/constants/constants";
import CustomToast from "../../../../CustomToast";
import { MAKER_CHECKER_SUB_ROUTES } from "../../../utils/constant";
import { WORKFLOW_SUB_ROUTES } from "../constant";
import { IAddWorkFlow } from "./useAddWorkFlow";

export const updateWorkFlowKey = `/workflows/:id`;

export default function useUpdateWorkFlow() {
  const { customToast } = CustomToast();
  const userType = useGetUserType();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const mutate = (_payload: IAddWorkFlow) => {
    setIsLoading(true);
    setTimeout(() => {
      customToast("Workflow modified successfully.", "SUCCESS");
      setIsLoading(false);
      navigate(
        `${BASE_ROUTES[userType]}/maker-checker/${MAKER_CHECKER_SUB_ROUTES.WORKFLOW}/${WORKFLOW_SUB_ROUTES.BASE}`
      );
    }, 500);
  };

  return { mutate, isLoading };
}
