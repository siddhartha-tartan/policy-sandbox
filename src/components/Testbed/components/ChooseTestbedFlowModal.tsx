import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import {
  ClockCircle,
  DocumentText,
  Filter,
  Globe,
  Security,
  Setting,
} from "react-huge-icons/outline";
import { FaArrowRight, FaDatabase, FaHistory } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import EventBus from "../../../EventBus";
import { userStore } from "../../../store/userStore";
import { BASE_ROUTES } from "../../../utils/constants/constants";
import CustomModal from "../../common/CustomModal";
import CustomButton from "../../DesignSystem/CustomButton";
import CustomText from "../../DesignSystem/Typography/CustomText";
import { TESTBED_SUB_ROUTES } from "../contants";

export const EVENT_OPEN_TESTBED_FLOW_SELECTION_MODAL =
  "EVENT_OPEN_TESTBED_FLOW_SELECTION_MODAL";

export default function ChooseTestbedFlowModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();
  const { policyId, categoryId, fileId } = useParams();
  const { userType } = userStore();
  const approachCards = [
    {
      icon: FaDatabase,
      title: "Advanced Data Creation",
      bullets: [
        { icon: Filter, text: "Granular Control on Test Data" },
        { icon: Setting, text: "Extensive customization" },
        { icon: Security, text: "Comprehensive data" },
      ],
      onClick: () => {
        navigate(
          `${BASE_ROUTES[userType]}/testbed/${TESTBED_SUB_ROUTES.ADVANCED_DATA_CREATION}/${categoryId}/${policyId}/${fileId}`
        );
      },
      isDisabled: false,
    },
    // {
    //   icon: FaRobot,
    //   title: "AI - Powered Testing",
    //   bullets: [
    //     { icon: FlashAuto, text: "Minimal manual intervention" },
    //     { icon: MinimizeRectangleDoted, text: "Smart edge case detection" },
    //     { icon: FaMagic, text: "Production - quality simulation" },
    //   ],
    //   onClick: () => {},
    //   isDisabled: true,
    // },
    {
      icon: FaHistory,
      title: "Historical Data Testing",
      bullets: [
        { icon: ClockCircle, text: "Use existing datasets" },
        { icon: DocumentText, text: "Proven test scenarios" },
        { icon: Globe, text: "Real - world insights" },
      ],
      onClick: () => {
        navigate(
          `${BASE_ROUTES[userType]}/testbed/${TESTBED_SUB_ROUTES.HISTORICAL_DATA_TESTING}/${categoryId}/${policyId}/${fileId}`
        );
      },
      isDisabled: false,
    },
  ];

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    eventBus.addListener(EVENT_OPEN_TESTBED_FLOW_SELECTION_MODAL, onOpen);

    return () => {
      eventBus.removeListener(onOpen);
    };
  }, [onOpen]);

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <Box className="p-6 w-[600px] flex flex-col gap-6">
        <Flex className="w-full justify-between items-center">
          <CloseIcon className="opacity-0" />
          <Flex className="flex-col gap-2 justify-center">
            <CustomText stylearr={[20, 32, 700]} className="text-center">
              Choose Your Testing Approach
            </CustomText>
            <CustomText
              stylearr={[14, 18, 500]}
              className="text-[#717073] text-center"
            >
              Select the method that best suits your testing requirements
            </CustomText>
          </Flex>
          <CloseIcon className="cursor-pointer" onClick={onClose} />
        </Flex>
        {/* Cards Container */}
        <div className="flex gap-6 grow">
          {approachCards?.map(
            ({ icon: Icon, title, bullets, onClick, isDisabled }) => (
              <div
                key={title}
                className="bg-white border-[#F3F2F5] border-[1px] rounded-[10px] px-[20px] py-[16px] grow gap-[10px] flex flex-col"
              >
                {/* Card Icon & Title */}
                <div
                  style={{
                    background:
                      "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
                  }}
                  className="w-[24px] h-[24px] flex justify-center items-center rounded-[4px]"
                >
                  <Icon className="text-[12px] text-[#fff]" />
                </div>
                <CustomText stylearr={[16, 25, 700]} className="text-[#141414]">
                  {title}
                </CustomText>

                {/* Bullets with different icons */}

                {bullets?.map(({ icon: BulletIcon, text }, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <BulletIcon className="text-[#3762DD] text-[16px] mt-1" />
                    <CustomText
                      stylearr={[12, 19, 500]}
                      className="text-gray-600"
                    >
                      {text}
                    </CustomText>
                  </div>
                ))}

                <CustomButton
                  style={{
                    background:
                      "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                  className="mt-2"
                  onClick={onClick}
                  isDisabled={isDisabled}
                >
                  <Flex className="items-center gap-2">
                    <CustomText stylearr={[14, 20, 600]}>
                      Get Started
                    </CustomText>
                    <FaArrowRight />
                  </Flex>
                </CustomButton>
              </div>
            )
          )}
        </div>
      </Box>
    </CustomModal>
  );
}
