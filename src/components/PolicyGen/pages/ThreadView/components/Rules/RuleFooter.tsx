import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { LuCode2 } from "react-icons/lu";
import { TbLogicAnd } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import EventBus from "../../../../../../EventBus";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import ChooseTestbedFlowModal, {
  EVENT_OPEN_TESTBED_FLOW_SELECTION_MODAL,
} from "../../../../../Testbed/components/ChooseTestbedFlowModal";
import { rulesLoadingAtom } from "../../../../atom";
import useGenerateVariableMapping from "../../hooks/useGenerateVariableMapping";
import useTestLogic from "../../hooks/useTestLogic";
import { EVENT_OPEN_GENERATE_PROCESSING } from "./GenerateProcessingModal";
import { EVENT_INITIATE_BRE_OPEN_MODAL } from "./InitiateBreModal";

export default function RuleFooter() {
  const {
    mutate: generateVariableMapping,
    isLoading: isVariableMappingLoading,
  } = useGenerateVariableMapping();
  const isEditRulesLoading = useAtomValue(rulesLoadingAtom);
  const { isLoading, data } = useTestLogic();

  const navigate = useNavigate();
  const appendQueryParam = (key: string, value: string) => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.set(key, value); // Add or update the query param
    navigate(`?${currentParams.toString()}`, { replace: false });
  };
  useEffect(() => {
    const requestId = data?.data?.request_id;
    if (requestId) {
      if (requestId) {
        appendQueryParam("code_request_id", requestId);
        EventBus.getInstance().fireEvent(EVENT_OPEN_GENERATE_PROCESSING, {
          type: "test",
        });
      }
    }
  }, [data]);

  return (
    <Flex className="w-full justify-end gap-6">
      {/* {enabledFeature?.includes("KnowYourClient") && (
        <CustomButton
          w={"220px"}
          variant="secondary"
          borderColor={"#141414"}
          color={"#141414"}
          isDisabled={isLoading}
          onClick={() => {
            setClick("invite your customer");
            mutate({ prompt: "" });
          }}
        >
          <Flex className="items-center gap-2">
            <CustomText stylearr={[14, 20, 600]}>
              Invite Your Customer
            </CustomText>
            <TbLogicAnd />
          </Flex>
        </CustomButton>
      )} */}
      <CustomButton
        w={"220px"}
        variant="secondary"
        borderColor={"#141414"}
        color={"#141414"}
        isLoading={isLoading}
        onClick={() => {
          // EventBus.getInstance().fireEvent(
          //   EVENT_OPEN_TEST_COMING_SOON_MODAL,
          //   "logic"
          // );
          EventBus.getInstance().fireEvent(
            EVENT_OPEN_TESTBED_FLOW_SELECTION_MODAL
          );
        }}
        isDisabled={isEditRulesLoading}
      >
        <Flex className="items-center gap-2">
          <CustomText stylearr={[14, 20, 600]}>Test Logic</CustomText>
          <TbLogicAnd />
        </Flex>
      </CustomButton>
      <Flex className="flex-row gap-2 items-center">
        <CustomButton
          w={"220px"}
          style={{
            background:
              "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
            fontSize: "14px",
            fontWeight: 600,
          }}
          onClick={() => generateVariableMapping()}
          isLoading={isVariableMappingLoading}
          isDisabled={isVariableMappingLoading}
        >
          <Flex className="items-center gap-2">
            <CustomText stylearr={[14, 20, 600]}>Review Variables</CustomText>
            <LuCode2 />
          </Flex>
        </CustomButton>
        <ArrowForwardIcon color={"#304FFE"} />
        <CustomButton
          w={"220px"}
          style={{
            background:
              "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
            fontSize: "14px",
            fontWeight: 600,
          }}
          onClick={() => {
            // EventBus.getInstance().fireEvent(EVENT_OPEN_CONFIRM_GENERATE);
            EventBus.getInstance().fireEvent(EVENT_INITIATE_BRE_OPEN_MODAL);
          }}
          isDisabled={isEditRulesLoading}
        >
          <Flex className="items-center gap-2">
            <CustomText stylearr={[14, 20, 600]}>
              Initiate BRE Update
            </CustomText>
            {/* <LuCode2 /> */}
          </Flex>
        </CustomButton>
      </Flex>
      <ChooseTestbedFlowModal />
    </Flex>
  );
}
