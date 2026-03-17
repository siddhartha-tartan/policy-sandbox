import { useState } from "react";
import CustomToast from "../../../../CustomToast";

export const updateWorkFlowStatusKey = `/workflows/:id/status`;
export interface IUpdateWorkFlowStatus {
  id: string;
  is_active: boolean;
}

export default function useUpdateWorkFlowStatus() {
  const { customToast } = CustomToast();
  const [isLoading, setIsLoading] = useState(false);

  const mutate = (_payload: IUpdateWorkFlowStatus) => {
    setIsLoading(true);
    setTimeout(() => {
      customToast("Workflow status modified successfully.", "SUCCESS");
      setIsLoading(false);
    }, 400);
  };

  return { mutate, isLoading };
}
