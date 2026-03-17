import { Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import EventBus from "../../../../../EventBus";
import CustomModal from "../../../../common/CustomModal";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { Policy } from "../../../hooks/useGetPolicies";

export const EVENT_OPEN_REVIEW_MODAL = "EVENT_OPEN_REVIEW_MODAL";

export default function ReviewModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [_, setData] = useState<Policy | null>(null);

  useEffect(() => {
    const openModal = (e: Policy) => {
      setData(e);
      onOpen();
    };

    EventBus.getInstance().addListener(EVENT_OPEN_REVIEW_MODAL, openModal);
    return () => {
      EventBus.getInstance().removeListener(openModal);
    };
  }, []);

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <Flex w={"400px"} className="rounded-[12px] flex-col bg-white p-6 gap-6">
        <Flex className="flex-col gap-[18px]">
          <CustomText className="text-center" stylearr={[16, 20, 700]}>
            Policy review in progress
          </CustomText>
          <CustomText className="text-center" stylearr={[14, 20, 500]}>
            Your policy is currently being reviewed
          </CustomText>
        </Flex>
        <Flex className="flex-col gap-[19px]">
          <CustomText stylearr={[16, 24, 700]} color={"#475467"}>
            Pending Approvals
          </CustomText>
          {[
            {
              name: "Anmol Jain",
              status: "Pending Approval",
              position: "Policy Head",
            },
            {
              name: "Archit Raheja",
              status: "Pending Approval",
              position: "Program Head",
            },
          ]?.map((row, id) => {
            return (
              <Flex
                key={`review-${id}`}
                className="justify-between w-full p-4 items-center bg-[#F3F2F5] rounded-[8px]"
              >
                <Flex className="flex-col gap-2">
                  <CustomText stylearr={[16, 24, 500]}>{row.name}</CustomText>
                  <CustomText stylearr={[12, 12, 500]}>
                    {row.position}
                  </CustomText>
                </Flex>
                <Flex className="bg-[#E8EAF6] rounded-[4px] p-1 text-[#1A237E]">
                  <CustomText stylearr={[12, 19, 500]}>{row.status}</CustomText>
                </Flex>
              </Flex>
            );
          })}
        </Flex>
        <CustomButton className="h-[69px] bg-[#263238]" onClick={onClose}>
          Understood
        </CustomButton>
      </Flex>
    </CustomModal>
  );
}
