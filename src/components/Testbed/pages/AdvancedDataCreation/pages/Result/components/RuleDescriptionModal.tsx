import { CloseButton, Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import EventBus from "../../../../../../../EventBus";
import CustomModal from "../../../../../../common/CustomModal";
import { systemColors } from "../../../../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import { useAtomValue } from "jotai";
import { policyDataAtom } from "../../../advancedDataCreationAtom";

export const EVENT_OPEN_RULE_DESCRIPTION = "EVENT_OPEN_RULE_DESCRIPTION";

export default function RuleDescriptionModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [data, setData] = useState<Record<string, any> | null>(null);
  const policyData = useAtomValue(policyDataAtom);

  useEffect(() => {
    const openModal = (e: Record<string, any>) => {
      onOpen();
      setData(e);
    };

    EventBus.getInstance().addListener(EVENT_OPEN_RULE_DESCRIPTION, openModal);
    return () => {
      EventBus.getInstance().removeListener(openModal);
    };
  }, []);

  const config = [
    { label: "Rule Id", value: data?.rule_code },
    //@ts-ignore
    { label: "Policy Version", value: policyData?.version },
    { label: "Rule Version", value: "V1" },
  ];

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      className="w-[455px] flex-col border-0 rounded-[4px] p-0"
    >
      <Flex
        className="flex-row justify-between px-6 py-2 rounded-t-[4px] w-full items-center"
        background={"linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"}
      >
        <Flex className="flex-col">
          <CustomText
            stylearr={[16, 32, 700]}
            letterSpacing={"0.16px"}
            color={systemColors.white.absolute}
          >
            {data?.variable_title}
          </CustomText>
          <CustomText
            stylearr={[12, 32, 600]}
            letterSpacing={"0.12px"}
            color={systemColors.white.absolute}
          >
            Policy : {policyData?.name}
          </CustomText>
        </Flex>
        <CloseButton onClick={onClose} color={"#FFF"} />
      </Flex>
      <Flex className="flex-col p-4 gap-6 w-full">
        <Flex className="flex-row">
          {config?.map((item) => (
            <Flex className="flex-col gap-2 w-1/3" key={item.label}>
              <CustomText stylearr={[12, 17, 500]} color={"#717073"}>
                {item.label}
              </CustomText>
              <CustomText stylearr={[14, 20, 700]}>{item.value}</CustomText>
            </Flex>
          ))}
        </Flex>
        <Flex className="flex-col gap-4">
          <CustomText stylearr={[12, 17, 500]} color={"#717073"}>
            Condition
          </CustomText>
          <Flex
            className="flex-row gap-2 p-1 rounded-[4px]"
            background={"#FAFAFA"}
          >
            <Flex
              className="w-[18px] h-[18px] rounded-full text-xs  items-center justify-center font-medium"
              background={
                "linear-gradient(231deg, rgba(55, 98, 221, 0.00) 13.46%, rgba(55, 98, 221, 0.20) 194.11%)"
              }
              color={"#3762DD"}
            >
              1
            </Flex>
            <CustomText stylearr={[12, 17, 600]}>
              {" "}
              {data?.condition_expression}
            </CustomText>
          </Flex>
        </Flex>
        <Flex className="flex-col gap-4">
          <CustomText stylearr={[12, 17, 500]} color={"#717073"}>
            Action
          </CustomText>
          <Flex
            className="flex-row gap-2 p-1 rounded-[4px]"
            background={"#FAFAFA"}
          >
            <Flex
              className="w-[18px] h-[18px] rounded-full text-xs items-center justify-center font-medium"
              background={
                "linear-gradient(231deg, rgba(55, 98, 221, 0.00) 13.46%, rgba(55, 98, 221, 0.20) 194.11%)"
              }
              color={"#3762DD"}
            >
              1
            </Flex>
            <CustomText stylearr={[12, 17, 600]}>{data?.action}</CustomText>
          </Flex>
        </Flex>
      </Flex>
    </CustomModal>
  );
}
