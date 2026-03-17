import { Divider } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import useGetUserType from "../../../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../../../utils/constants/constants";
import CustomButton from "../../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import HeaderBackCta from "../../../../../HeaderBackCta";
import PageLayout from "../../../../../PageLayout";
import { MAKER_CHECKER_SUB_ROUTES } from "../../../../utils/constant";
import {
  initialWorkFlowValues,
  levelFormDataAtom,
  workflowFormDataAtom,
} from "../../atom";
import { WORKFLOW_SUB_ROUTES } from "../../constant";
import useAddWorkFlow from "../../hooks/useAddWorkFlow";
import useGetWorkFlowById from "../../hooks/useGetWorkFlowById";
import LevelsForm, { LevelFormInitialValue } from "./components/LevelsForm";
import WorkFlowForm from "./components/WorkFlowForm";
import { validateLevelData } from "./utils/helpers";
import useUpdateWorkFlow from "../../hooks/useUpdateWorkFlow";

const AddWorkFlow = ({ id }: { id?: string }) => {
  const { workFlowData, levelData: levels } = useGetWorkFlowById();
  const [formData, setFormData] = useAtom(workflowFormDataAtom);
  const [levelData, setLevelData] = useAtom(levelFormDataAtom);
  const { mutate: addWorkflow, isLoading: isAddWorkflowloading } =
    useAddWorkFlow();
  const { mutate: updateWorkflow, isLoading: isUpdateWorkflowloading } =
    useUpdateWorkFlow();
  const [disabled, setDisabled] = useState<boolean>(true);
  const userType = useGetUserType();
  useEffect(() => {
    if (id) {
      setFormData(workFlowData || initialWorkFlowValues);
      setLevelData(levels);
    } else {
      setFormData(initialWorkFlowValues);
      setLevelData([LevelFormInitialValue]);
    }
  }, [workFlowData, levels, id]);

  useEffect(() => {
    if (
      !formData?.module_id?.length ||
      !formData?.name ||
      !formData?.entity_types?.length
    ) {
      setDisabled(true);
    } else if (validateLevelData(levelData)) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [formData, levelData]);

  const handleAddClick = () => {
    const payload = { ...formData, levels: levelData };
    const mutate = id ? updateWorkflow : addWorkflow;
    mutate(payload);
  };
  const shouldShowRecentActivity = false;
  return (
    <PageLayout pb={4}>
      <HeaderBackCta
        navigateTo={`${BASE_ROUTES[userType]}/maker-checker/${MAKER_CHECKER_SUB_ROUTES.WORKFLOW}/${WORKFLOW_SUB_ROUTES.BASE}`}
      />
      <div className="flex flex-row gap-4 p-6 rounded-[16px] bg-white w-full h-full overflow-y-auto  [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-grey-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-white">
        <div className="flex flex-col gap-6 grow h-full">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col gap-2">
              <CustomText stylearr={[22, 26, 700]}>
                {id ? "Edit Workflow" : "Create New Workflow"}
              </CustomText>
              <CustomText stylearr={[12, 14, 600]} color={"#555557"}>
                {id
                  ? "Modify existing workflow"
                  : "Control and Automate Your Approval Process"}
              </CustomText>
            </div>
            <CustomButton
              variant="quaternary"
              className="py-[21px] px-6 text-sm font-semibold h-[45px] tracking-[0.3px]"
              isDisabled={
                disabled || isAddWorkflowloading || isUpdateWorkflowloading
              }
              isLoading={isAddWorkflowloading || isUpdateWorkflowloading}
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                >
                  <path
                    d="M13.7069 5.00001L11.5 2.79313C11.4075 2.69987 11.2973 2.62593 11.176 2.5756C11.0546 2.52528 10.9245 2.49959 10.7931 2.50001H3C2.73478 2.50001 2.48043 2.60536 2.29289 2.7929C2.10536 2.98043 2 3.23479 2 3.50001V13.5C2 13.7652 2.10536 14.0196 2.29289 14.2071C2.48043 14.3946 2.73478 14.5 3 14.5H13C13.2652 14.5 13.5196 14.3946 13.7071 14.2071C13.8946 14.0196 14 13.7652 14 13.5V5.70688C14.0004 5.57551 13.9747 5.44537 13.9244 5.32402C13.8741 5.20266 13.8001 5.09253 13.7069 5.00001ZM10.5 13.5H5.5V10H10.5V13.5ZM13 13.5H11.5V10C11.5 9.73479 11.3946 9.48043 11.2071 9.2929C11.0196 9.10536 10.7652 9.00001 10.5 9.00001H5.5C5.23478 9.00001 4.98043 9.10536 4.79289 9.2929C4.60536 9.48043 4.5 9.73479 4.5 10V13.5H3V3.50001H10.7931L13 5.70688V13.5ZM10 5.00001C10 5.13261 9.94732 5.25979 9.85355 5.35356C9.75979 5.44733 9.63261 5.50001 9.5 5.50001H6C5.86739 5.50001 5.74021 5.44733 5.64645 5.35356C5.55268 5.25979 5.5 5.13261 5.5 5.00001C5.5 4.8674 5.55268 4.74022 5.64645 4.64645C5.74021 4.55268 5.86739 4.50001 6 4.50001H9.5C9.63261 4.50001 9.75979 4.55268 9.85355 4.64645C9.94732 4.74022 10 4.8674 10 5.00001Z"
                    fill="white"
                  />
                </svg>
              }
              onClick={handleAddClick}
            >
              Save Workflow
            </CustomButton>
          </div>
          <div className="flex flex-row gap-4 h-full">
            <div className={`flex flex-col gap-6 w-full h-full`}>
              <WorkFlowForm
                shouldShowRecentActivity={shouldShowRecentActivity}
              />
              {!shouldShowRecentActivity && <Divider />}
              <LevelsForm shouldShowRecentActivity={shouldShowRecentActivity} />
            </div>
            {/* {id && (
              <RecentActivity className="w-1/2 h-fit max-h-[450px] overflow-y-auto" />
            )} */}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AddWorkFlow;
