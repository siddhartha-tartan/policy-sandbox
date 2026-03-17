import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Trash } from "react-huge-icons/outline";
import CustomButton from "../../../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../../../DesignSystem/Typography/CustomText";
import useGetApprovalUsers from "../../../../../common/hooks/useGetApprovalUser";
import { levelFormDataAtom, workflowFormDataAtom } from "../../../atom";
import { ApprovalType, IAddWorkFlowUser } from "../../../hooks/useAddWorkFlow";
import UserSelectionDropdown from "./UserSelectionDropdown";

export const LevelFormInitialValue = {
  approval_type: ApprovalType.ONE,
  required_approvals: 1,
  users: [],
  level_number: 1,
};

const LevelsForm = ({
  shouldShowRecentActivity,
}: {
  shouldShowRecentActivity: boolean;
}) => {
  const [formData, setFormData] = useAtom(levelFormDataAtom);
  const workflowFormData = useAtomValue(workflowFormDataAtom);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { data: users } = useGetApprovalUsers(selectedCategory);

  useEffect(() => {
    if (workflowFormData?.entity_types) {
      setSelectedCategory(workflowFormData?.entity_types[0]);
    } else {
      setSelectedCategory("");
    }
  }, [workflowFormData?.entity_types]);

  const handleAddLevel = () => {
    setFormData((prev) => [...prev, LevelFormInitialValue]);
  };

  const handleUsersChange = (id: number, users: IAddWorkFlowUser[]) => {
    setFormData((prev) => {
      const newFormData = [...prev];
      newFormData[id] = {
        ...newFormData[id],
        users,
        level_number: id + 1,
      };
      return newFormData;
    });
  };

  const handleApprovalTypeChange = (
    id: number,
    approvalValue: ApprovalType,
    users: IAddWorkFlowUser[]
  ) => {
    setFormData((prev) => {
      const newFormData = [...prev];
      newFormData[id] = {
        ...newFormData[id],
        approval_type: approvalValue,
        required_approvals:
          approvalValue === ApprovalType.ONE ? 1 : users?.length || 1,
      };
      return newFormData;
    });
  };

  const handleCustomApproverChange = (id: number, value: number) => {
    setFormData((prev) => {
      const newFormData = [...prev];
      newFormData[id] = {
        ...newFormData[id],
        required_approvals: value,
      };
      return newFormData;
    });
  };

  const handleRemoveLevel = (index: number) => {
    setFormData((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`flex flex-col gap-6 w-full h-full ${
        shouldShowRecentActivity && "p-4 border rounded-[16px]"
      }`}
    >
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-col gap-2">
          <CustomText stylearr={[15, 18, 600]}>Approval Levels</CustomText>
          <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
            Define the hierarchy and sequence of approvers for this workflow
            process
          </CustomText>
        </div>
        <CustomButton
          variant="quinary"
          className="w-[144px] h-[45px] text-sm"
          onClick={handleAddLevel}
        >
          Add Level
        </CustomButton>
      </div>
      {formData?.map((item, index) => {
        const approvalType = item?.approval_type;
        const requiredApprovals = item?.required_approvals;
        const selectedUsers = item?.users || [];

        return (
          <div
            className={`flex flex-col gap-[10px] w-full ${
              shouldShowRecentActivity && "border rounded-[10px] p-4"
            }`}
            key={`levelform-${index}${item?.users?.length}`}
          >
            <div
              className={`flex flex-row justify-between ${
                shouldShowRecentActivity ? "w-full" : "w-1/2"
              }`}
            >
              {" "}
              <CustomText stylearr={[14, 22, 500]}>
                Level {index + 1}
              </CustomText>
              <Trash
                className="mr-4 text-[#E64A19] cursor-pointer"
                onClick={() => handleRemoveLevel(index)}
              />
            </div>

            <div
              className={`flex gap-6 w-full ${
                shouldShowRecentActivity ? "flex-col" : "flex-row"
              }`}
            >
              <UserSelectionDropdown
                value={selectedUsers}
                onChange={(selected: IAddWorkFlowUser[]) =>
                  handleUsersChange(index, selected)
                }
                options={
                  selectedCategory
                    ? Array.from(
                        new Map(
                          [...selectedUsers, ...users]?.map((user) => [
                            user?.user_id,
                            user,
                          ])
                        ).values()
                      )
                    : []
                }
                key={selectedUsers?.length}
              />
              <div
                className={`flex flex-col gap-4 mt-[-24px] ${
                  shouldShowRecentActivity ? "w-full" : "w-1/2"
                }`}
              >
                <CustomText stylearr={[14, 22, 400]}>
                  Minimal Approval Criteria
                </CustomText>
                <RadioGroup
                  onChange={(e) =>
                    handleApprovalTypeChange(
                      index,
                      e as ApprovalType,
                      selectedUsers
                    )
                  }
                  value={approvalType}
                >
                  <Stack direction="row" gap={6} alignItems={"center"}>
                    <Radio value={ApprovalType.ALL} size={"sm"}>
                      All
                    </Radio>
                    <Radio value={ApprovalType.ONE} size={"sm"}>
                      Anyone
                    </Radio>
                    <Radio value={ApprovalType.N} size={"sm"}>
                      Custom
                    </Radio>
                    {approvalType === ApprovalType.N && (
                      <div
                        className={`flex flex-row gap-1 items-end ${
                          shouldShowRecentActivity && "ml-4"
                        }`}
                      >
                        <input
                          type="number"
                          value={requiredApprovals}
                          onChange={(e) =>
                            handleCustomApproverChange(
                              index,
                              Number(e.target.value)
                            )
                          }
                          className="w-[30px] text-xs font-semibold border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-400 px-0 py-1 outline-none appearance-none"
                        />
                        <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
                          out of total {selectedUsers?.length} users
                        </CustomText>
                      </div>
                    )}
                  </Stack>
                </RadioGroup>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LevelsForm;
