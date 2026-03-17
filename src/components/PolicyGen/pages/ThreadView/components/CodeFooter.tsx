import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { TbLogicAnd } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import EventBus from "../../../../../EventBus";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import useTestLogic from "../hooks/useTestLogic";
import { EVENT_OPEN_GENERATE_PROCESSING } from "./Rules/GenerateProcessingModal";
import { EVENT_OPEN_TEST_COMING_SOON_MODAL } from "./TestComingSoonModal";

export default function CodeFooter() {
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
    <Flex className="w-full justify-end">
      <CustomButton
        w={"220px"}
        isLoading={isLoading}
        onClick={() => {
          // EventBus.getInstance().fireEvent(EVENT_OPEN_COMING_SOON_MODAL)
          // mutate({ prompt: "" });
          EventBus.getInstance().fireEvent(
            EVENT_OPEN_TEST_COMING_SOON_MODAL,
            "code"
          );
        }}
      >
        <Flex className="items-center gap-2">
          <CustomText stylearr={[14, 20, 600]}>Test Code</CustomText>
          <TbLogicAnd />
        </Flex>
      </CustomButton>
    </Flex>
  );
}
