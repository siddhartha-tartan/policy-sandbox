import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Tick } from "react-huge-icons/solid";
import { RxCross2 } from "react-icons/rx";
import { IOption } from "../../dashboards/Spoc/Assessment/pages/IndivisualAssesment/hooks/useGetAssesment";
import { customColors } from "../DesignSystem/Colors/CustomColors";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import Badge from "./Badge";

interface ViewMcqProps {
  incorrect?: string;
  correct?: string;
  question: string;
  options: IOption[];
  skipped?: boolean;
}

const verdictConfig = {
  incorrect: {
    label: "Incorrect",
    color: systemColors.red[500],
  },
  correct: {
    label: "Correct",
    color: systemColors.green[400],
  },
  missed: {
    label: "Missed",
    color: systemColors.orange[500],
  },
};

const variantConfig = {
  incorrect: {
    color: systemColors.red[500],
    bgColor: systemColors.red[50],
    bulletColor: systemColors.red[600],
    badgeLabel: "Wrong Answer",
    icon: <RxCross2 fontSize={"24px"} />,
  },
  correct: {
    color: systemColors.green[500],
    bgColor: systemColors.green[50],
    bulletColor: systemColors.green[600],
    badgeLabel: "Correct Answer",
    icon: <Tick fontSize={"24px"} />,
  },
  neutral: {
    color: customColors.PALE_SKY,
    bgColor: systemColors.white.absolute,
    bulletColor: customColors.PALE_SKY,
    icon: <React.Fragment />,
  },
};

export default function ViewMcq({
  incorrect = "",
  correct = "",
  question,
  options,
  skipped = false,
}: ViewMcqProps) {
  const verdict = skipped
    ? "missed"
    : incorrect === "" && correct === ""
    ? "missed"
    : incorrect === ""
    ? "correct"
    : "incorrect";
  return (
    <Flex
      p="24px"
      w="100%"
      borderRadius="16px"
      bgColor={systemColors.white.absolute}
      gap={4}
      flexDirection="column"
    >
      <Text
        fontSize="14px"
        fontWeight={700}
        color={verdictConfig[verdict].color}
      >
        {verdictConfig[verdict].label}
      </Text>
      <Text color={systemColors.grey[900]} fontSize="18px" fontWeight={600}>
        {question}
      </Text>
      <Flex flexDirection="column" gap={2}>
        {options?.map((row, id) => {
          const variant =
            correct === row.value
              ? "correct"
              : incorrect === row.value
              ? "incorrect"
              : "neutral";

          return (
            <Flex
              key={id}
              alignItems="center"
              justifyContent={"space-between"}
              borderRadius="8px"
              {...variantConfig[variant]}
              py={variant === "neutral" ? 0 : 2}
              px={2}
            >
              <Flex gap={2} alignItems="center">
                <Box
                  width="4px"
                  height="4px"
                  bgColor={variantConfig[variant].bulletColor}
                  borderRadius="50%"
                />
                <Text fontSize="14px" fontWeight={500}>
                  {row.label}
                </Text>
              </Flex>
              {variant !== "neutral" && (
                <Badge
                  {...variantConfig[variant]}
                  text={variantConfig[variant].badgeLabel}
                  leftIcon={variantConfig[variant]?.icon}
                />
              )}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}
