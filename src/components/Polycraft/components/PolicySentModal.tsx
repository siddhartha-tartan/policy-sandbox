import { Flex, Image, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import EventBus from "../../../EventBus";
import CheckedSVG from "../../../assets/Icons/checked.svg";
import { systemColors } from "../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../DesignSystem/CustomButton";
import CustomModal from "../../common/CustomModal";
import { useNavigate } from "react-router-dom";
import { BASE_ROUTES } from "../../../utils/constants/constants";
import useGetUserType from "../../../hooks/useGetUserType";
import { POLYCRAFT_SUB_ROUTES } from "../constants";

export const EVENT_OPEN_POLICY_SENT_MODAL = "EVENT_OPEN_POLICY_SENT_MODAL";

const PolicySentModal = ({
  onViewStatusClick,
}: {
  onViewStatusClick: Function;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const userType = useGetUserType();

  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_POLICY_SENT_MODAL, onOpen);
    return () => {
      EventBus.getInstance().removeListener(onOpen);
    };
  }, []);

  return (
    isOpen && (
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        className="p-6 pt-8 w-[500px] "
      >
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-3 justify-center items-center">
            <Image className="" src={CheckedSVG} />
            <div className="font-bold text-[22px] text-[#141414]">
              Policy Sent for Approval
            </div>
            <Text
              mb={4}
              color="gray.600"
              className="text-sm flex justify-center items-center text-center font-medium"
            >
              Your policy has been sent for review
              <br />
              On approval it would be automatically published.
            </Text>
          </div>

          <div>
            <Flex w="full" gap="24px">
              <CustomButton
                borderRadius="8px"
                borderColor={systemColors.black[200]}
                variant="tertiary"
                className="text-[13.095px] font-medium"
                flex={1}
                onClick={() => {
                  navigate(
                    `${BASE_ROUTES[userType]}/polycraft/${POLYCRAFT_SUB_ROUTES.BASE}`
                  );
                }}
              >
                Go to Dashboard
              </CustomButton>
              <CustomButton
                bgColor={systemColors.grey[900]}
                className="text-[13.095px] font-semibold"
                style={{
                  background: `linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)`,
                }}
                borderRadius="8px"
                flex={1}
                onClick={() => onViewStatusClick()}
              >
                View Status
              </CustomButton>
            </Flex>
          </div>
        </div>
      </CustomModal>
    )
  );
};

export default PolicySentModal;
