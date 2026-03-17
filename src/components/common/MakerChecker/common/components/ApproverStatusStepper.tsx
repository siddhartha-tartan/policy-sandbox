import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Circle,
  Divider,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { ApprovalStep } from "../../../../Polycraft/pages/ViewPolicy/view";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { formatUserType } from "../../../../../utils/helpers/formatUserType";

interface TimelineComponentProps {
  data: ApprovalStep[];
  title: string;
}

const statusConfig = {
  APPROVED: {
    color: "#38A169",
    icon: <CheckIcon color="white" boxSize={2} />,
    dividerStyle: {
      borderColor: "#38A169",
      borderStyle: "solid",
    },
  },
  REJECTED: {
    color: "#E53E3E",
    icon: <CloseIcon color="white" boxSize={2} />,
    dividerStyle: {
      borderColor: "#E53E3E",
      borderStyle: "solid",
    },
  },
  PENDING: {
    color: "#CBD5E0",
    icon: null,
    dividerStyle: {
      borderColor: "#CBD5E0",
      borderStyle: "dashed",
    },
  },
  IN_PROGRESS: {
    color: "#CBD5E0",
    icon: null,
    dividerStyle: {
      borderColor: "#CBD5E0",
      borderStyle: "dashed",
    },
  },
};

const getDividerStyles = (nextStep: ApprovalStep | undefined) => {
  if (!nextStep) return {};
  return statusConfig[nextStep?.status]?.dividerStyle;
};

const StepDetails = ({
  step,
  className = "",
}: {
  step: ApprovalStep;
  className: string;
}) => {
  const mainUser = step?.users?.[0];
  const hasAdditionalUsers = step?.users?.length > 1;

  return (
    <div className={`flex flex-col w-[150px] flex-wrap ${className}`}>
      <Popover trigger="hover" placement="top" gutter={0} isLazy>
        <PopoverTrigger>
          <Text
            as="span"
            cursor="pointer"
            fontSize={"16px"}
            lineHeight={"20px"}
            fontWeight={700}
          >
            {mainUser?.user_name || "-"}
            {hasAdditionalUsers && ` +${step?.users?.length - 1}`}
          </Text>
        </PopoverTrigger>
        <Portal>
          <PopoverContent width="auto" boxShadow="md" borderRadius="md">
            <PopoverBody p={0}>
              <Box maxH="160px" overflowY="auto">
                {step?.users?.map((user, index) => (
                  <Box key={index} position="relative">
                    <Box p={2} px={4}>
                      <Text fontSize="14px" fontWeight={500} color="#455A64">
                        {index + 1}. {user?.user_name}
                      </Text>
                    </Box>
                    <Divider />
                  </Box>
                ))}
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
      {mainUser?.role && (
        <CustomText stylearr={[13, 20, 500]} color={"#717073"}>
          {step?.level ? `Level ${step?.level} ` : ""}
          {formatUserType(mainUser?.role)}
        </CustomText>
      )}
      <CustomText stylearr={[13, 20, 500]} color={"#717073"}>
        {step?.timestamp || "---"}
      </CustomText>
    </div>
  );
};

export const ApproverStatusStepper: React.FC<TimelineComponentProps> = ({
  title,
  data,
}) => {
  if (!data?.length) return null;
  return (
    <Flex className="flex flex-col justify-start gap-2">
      <CustomText stylearr={[19, 20, 700]} color={"#455A64"}>
        {title}
      </CustomText>

      <Box position="relative" className="w-full">
        <Box className="overflow-x-auto" padding="10px 0">
          <Box position="relative" paddingRight="28px">
            {/* Container for dividers with absolute positioning */}
            <Box position="relative" height="20px" width="100%">
              {/* Dividers */}
              {data?.map((_, index) => (
                <React.Fragment key={index}>
                  {index < data?.length - 1 && (
                    <Divider
                      {...getDividerStyles(data[index + 1])}
                      borderWidth="1px"
                      position="absolute"
                      top="50%"
                      left={`${(index / (data.length - 1)) * 100}%`}
                      width={`${(1 / (data.length - 1)) * 100}%`}
                      minWidth="120px"
                      transform="translateY(-50%)"
                    />
                  )}
                </React.Fragment>
              ))}

              {/* Circles positioned on top of dividers */}
              <Flex
                justify="space-between"
                position="absolute"
                top="0"
                left="0"
                right="0"
                height="100%"
                zIndex="2"
              >
                {data?.map((step, index) => (
                  <Circle
                    key={index}
                    size="20px"
                    bg={
                      step?.status === "PENDING"
                        ? "white"
                        : statusConfig[step?.status]?.color
                    }
                    border={`1px solid ${statusConfig[step?.status]?.color}`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {statusConfig[step?.status]?.icon}
                  </Circle>
                ))}
              </Flex>
            </Box>

            {/* Step details */}
            <Flex justify="space-between" width="100%" paddingTop="4">
              {data?.map((step, index) => (
                <Box key={index}>
                  <StepDetails
                    step={step}
                    className={`${
                      index === data?.length - 1 ? "justify-end	text-right" : ""
                    }`}
                  />
                </Box>
              ))}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};
