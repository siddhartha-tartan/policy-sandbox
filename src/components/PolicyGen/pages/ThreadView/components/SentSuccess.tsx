import { Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventBus from "../../../../../EventBus";
import { userStore } from "../../../../../store/userStore";
import { BASE_ROUTES } from "../../../../../utils/constants/constants";
import CustomModal from "../../../../common/CustomModal";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { CloseIcon } from "@chakra-ui/icons";

export const EVENT_OPEN_SENT_SUCCESS_MODAL = "EVENT_OPEN_SENT_SUCCESS_MODAL";
export default function SentSuccessModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_SENT_SUCCESS_MODAL, onOpen);
    return () => EventBus.getInstance().removeListener(onOpen);
  }, []);

  const navigate = useNavigate();
  const { userType } = userStore();
  return (
    <CustomModal
      w={"400px"}
      className="rounded-[16px] bg-white px-[24px] py-[27px] flex flex-col gap-[42px]"
      isOpen={isOpen}
      onClose={onClose}
    >
      <CloseIcon
        onClick={onClose}
        className="absolute top-4 right-4 cursor-pointer"
        fontSize={"12px"}
      />
      <Flex className="gap-3 flex-col">
        <CustomText stylearr={[20, 24, 800]} className="text-center">
          Code sent for review
        </CustomText>
        <CustomText stylearr={[16, 24, 500]} className="text-center">
          Your code has been send for review, post approval, it will be send for
          deployment
        </CustomText>
      </Flex>
      <Flex className="w-full gap-6">
        <CustomButton
          variant="secondary"
          color={"#3762DD"}
          className="flex-1"
          border={"1px solid #3762DD"}
          onClick={() => {
            navigate(`${BASE_ROUTES[userType]}/dashboard`);
            onClose();
          }}
        >
          <Flex className="items-center gap-2">
            {/* <ChevronLeftIcon fontSize={"25px"} /> */}
            <CustomText stylearr={[14, 20, 600]}>Go to Dashboard</CustomText>
          </Flex>
        </CustomButton>
      </Flex>
    </CustomModal>
  );
}
