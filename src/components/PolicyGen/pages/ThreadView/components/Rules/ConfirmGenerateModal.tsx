import { Flex, useDisclosure } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import PolicyGenWhiteIcon from "../../../../../../assets/Icons/PolicyGenWhiteIcon";
import EventBus from "../../../../../../EventBus";
import CustomModal from "../../../../../common/CustomModal";
import { systemColors } from "../../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import useGenerateCode, { CodeLanguage } from "../../hooks/useGenerateCode";
import { codeRequestIdAtom } from "../../threadAtom";
import { PolicyGenParamsEnum } from "../../utils/constant";
import { EVENT_OPEN_GENERATE_PROCESSING } from "./GenerateProcessingModal";

export const EVENT_OPEN_CONFIRM_GENERATE = "EVENT_OPEN_CONFIRM_GENERATE";
export default function ConfirmGenerateModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_CONFIRM_GENERATE, onOpen);
    return () => EventBus.getInstance().removeListener(onOpen);
  }, []);
  const { mutate, isLoading, data } = useGenerateCode();
  const requestId =
    useAtomValue(codeRequestIdAtom) ||
    new URLSearchParams(location.search).get(PolicyGenParamsEnum.CODE_ID)! ||
    data?.id;

  useEffect(() => {
    if (requestId) {
      onClose();
      EventBus.getInstance().fireEvent(EVENT_OPEN_GENERATE_PROCESSING, {
        type: "generate",
      });
    }
  }, [requestId]);
  return (
    <CustomModal
      w={"472px"}
      className="rounded-[16px] bg-white px-[24px] py-[27px] flex flex-col gap-[42px]"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Flex className="gap-3 flex-col">
        <CustomText stylearr={[20, 24, 800]} className="text-center">
          Confirm rules before generating code
        </CustomText>
        <CustomText stylearr={[16, 24, 500]} className="text-center">
          Although our model has high-accuracy, please review them to ensure
          error free code.
        </CustomText>
      </Flex>
      <Flex className="w-full gap-6">
        <CustomButton
          variant="secondary"
          color={"#3762DD"}
          className="flex-1"
          border={"1px solid #3762DD"}
          onClick={onClose}
        >
          <Flex className="items-center gap-2">
            {/* <CloseIcon fontSize={"10px"} /> */}
            <CustomText stylearr={[14, 20, 600]}>Review Rules</CustomText>
          </Flex>
        </CustomButton>
        <CustomButton
          style={{
            background: `linear-gradient(95deg, ${systemColors.indigo[350]} -1.14%, ${systemColors.indigo[600]} 158.31%)`,
          }}
          h={"47px"}
          isLoading={isLoading}
          onClick={() => {
            mutate({ codeLanguage: CodeLanguage.DROOLS });
          }}
          className="flex-1"
        >
          <Flex className="items-center gap-2">
            <PolicyGenWhiteIcon width="16px" />
            <CustomText stylearr={[14, 20, 600]}>Generate Code</CustomText>
          </Flex>
        </CustomButton>
      </Flex>
    </CustomModal>
  );
}
