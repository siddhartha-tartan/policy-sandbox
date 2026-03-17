import { CloseButton, Flex, Image, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import img from "../../../../../assets/Images/SuccessImage.png";
import EventBus from "../../../../../EventBus";
import CustomModal from "../../../../common/CustomModal";
import CustomText from "../../../../DesignSystem/Typography/CustomText";

export const EVENT_OPEN_SUCCESS_IMPORT_DESTINATION_VARIABLE =
  "EVENT_OPEN_SUCCESS_IMPORT_DESTINATION_VARIABLE";

const SuccessModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    EventBus.getInstance().addListener(
      EVENT_OPEN_SUCCESS_IMPORT_DESTINATION_VARIABLE,
      () => {
        onOpen();
      }
    );
    return () => {
      EventBus.getInstance().removeListener(onOpen);
    };
  }, []);
  return (
    <CustomModal
      w={"400px"}
      borderRadius={"16px"}
      isOpen={isOpen}
      onClose={() => {}}
      position={"absolute"}
      left={"55%"}
      top={"52%"}
    >
      <Flex
        className="flex-col gap-2 p-6 w-full justify-center text-center"
        position={"relative"}
      >
        <Image src={img} w={"66px"} h={"66px"} mx={"auto"} />
        <CustomText stylearr={[18, 28, 700]}>
          Variables Imported Successfully
        </CustomText>
        <CustomText
          stylearr={[14, 20, 500]}
          w={"276px"}
          mx={"auto"}
          color={"#475467"}
        >
          Your variables have been successfully mapped and added to the
          repository.
        </CustomText>
        <CloseButton
          position={"absolute"}
          right={4}
          top={4}
          onClick={onClose}
        />
      </Flex>
    </CustomModal>
  );
};

export default SuccessModal;
