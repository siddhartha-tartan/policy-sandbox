import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Circle, Flex, Text } from "@chakra-ui/react";
import { ApprovalStep } from "../../../../../Polycraft/pages/ViewPolicy/view";
import { formatUserType } from "../../../../../../utils/helpers/formatUserType";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";

const statusConfig = {
  APPROVED: {
    color: "#38A169",
    bg: "#38A169",
    icon: <CheckIcon color="white" boxSize={2} />,
    lineColor: "#38A169",
    lineStyle: "solid",
    label: "Approved",
    labelColor: "#38A169",
  },
  REJECTED: {
    color: "#E53E3E",
    bg: "#E53E3E",
    icon: <CloseIcon color="white" boxSize={2} />,
    lineColor: "#E53E3E",
    lineStyle: "solid",
    label: "Rejected",
    labelColor: "#E53E3E",
  },
  PENDING: {
    color: "#CBD5E0",
    bg: "white",
    icon: null,
    lineColor: "#CBD5E0",
    lineStyle: "dashed",
    label: "Pending",
    labelColor: "#A0AEC0",
  },
  IN_PROGRESS: {
    color: "#3762DD",
    bg: "white",
    icon: (
      <Box w="6px" h="6px" borderRadius="full" bg="#3762DD" />
    ),
    lineColor: "#CBD5E0",
    lineStyle: "dashed",
    label: "In Progress",
    labelColor: "#3762DD",
  },
};

interface VerticalTimelineProps {
  data: ApprovalStep[];
}

export default function VerticalTimeline({ data }: VerticalTimelineProps) {
  if (!data?.length) return null;

  return (
    <Flex direction="column" gap={0}>
      <CustomText stylearr={[13, 18, 700]} color="#455A64" mb={3}>
        Approval Timeline
      </CustomText>
      {data.map((step, index) => {
        const normalizedStatus = (step.status?.toUpperCase() || "PENDING") as keyof typeof statusConfig;
        const config = statusConfig[normalizedStatus] || statusConfig.PENDING;
        const isLast = index === data.length - 1;
        const mainUser = step.users?.[0];

        return (
          <Flex key={index} gap={3} position="relative">
            <Flex direction="column" align="center" flexShrink={0}>
              <Circle
                size="22px"
                bg={config.bg}
                border={`2px solid ${config.color}`}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {config.icon}
              </Circle>
              {!isLast && (
                <Box
                  w="0"
                  flexGrow={1}
                  minH="32px"
                  borderLeft="2px"
                  borderStyle={config.lineStyle as any}
                  borderColor={
                    statusConfig[(data[index + 1]?.status?.toUpperCase() || "PENDING") as keyof typeof statusConfig]?.lineColor || "#CBD5E0"
                  }
                />
              )}
            </Flex>

            <Flex direction="column" pb={isLast ? 0 : 4} pt="1px" minW={0}>
              <Flex align="center" gap={2}>
                <Text fontSize="13px" fontWeight={600} color="#1A202C" noOfLines={1}>
                  {step.level === 0
                    ? "Submitted"
                    : `Level ${step.level} Review`}
                </Text>
                <Text
                  fontSize="11px"
                  fontWeight={600}
                  color={config.labelColor}
                  bg={`${config.labelColor}14`}
                  px="6px"
                  py="1px"
                  borderRadius="4px"
                  whiteSpace="nowrap"
                >
                  {config.label}
                </Text>
              </Flex>
              {mainUser && (
                <Text fontSize="12px" color="#718096" mt="2px" noOfLines={1}>
                  {mainUser.user_name}
                  {mainUser.role ? ` · ${formatUserType(mainUser.role)}` : ""}
                  {step.users.length > 1 && ` +${step.users.length - 1}`}
                </Text>
              )}
              {step.timestamp && step.timestamp !== "---" && (
                <Text fontSize="11px" color="#A0AEC0" mt="1px">
                  {step.timestamp}
                </Text>
              )}
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
}
