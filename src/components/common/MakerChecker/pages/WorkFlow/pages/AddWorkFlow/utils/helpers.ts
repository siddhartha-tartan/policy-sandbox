import { IWorkFlowLevel } from "../../../hooks/useAddWorkFlow";

export function validateLevelData(data: IWorkFlowLevel[]): boolean {
  if (!data?.length) return false;
  for (const item of data) {
    if (
      !item?.approval_type ||
      !item.level_number ||
      !item?.required_approvals ||
      !item?.users?.length
    ) {
      return true;
    }
  }
  return false;
}
