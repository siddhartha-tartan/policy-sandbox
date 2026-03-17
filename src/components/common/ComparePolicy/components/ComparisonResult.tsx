import { Divider, Flex } from "@chakra-ui/react";
import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { LuDot } from "react-icons/lu";
import TwoToneRuleIcon from "../../../../assets/Icons/TwoToneRuleIcon";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import { NormData } from "../hooks/useGetPolicyComparison";

interface ChangeTypeProps {
  label: string;
  color: string;
  bgColor: string;
  items: string[];
  isStrikeThrough?: boolean;
}

const ChangeType = ({
  label,
  color,
  bgColor,
  items,
  isStrikeThrough = false,
}: ChangeTypeProps) =>
  items && items?.length ? (
    <Flex gap="35px" alignItems="flex-start">
      <Flex
        py="3"
        px="4"
        gap="2"
        rounded="xl"
        alignItems="center"
        bg={bgColor}
        w="125px"
      >
        <AiOutlinePlusCircle size="20px" color={color} />
        <CustomText stylearr={[14, 20, 600]} color={color}>
          {label}
        </CustomText>
      </Flex>
      <Flex flexDir="column" gap="2" w="full" my="auto">
        {items.map((item) => (
          <Flex alignItems="center" key={item}>
            <LuDot size="24px" />
            <CustomText
              stylearr={[14, 20, 600]}
              textDecoration={isStrikeThrough ? "line-through" : "none"}
            >
              {item}
            </CustomText>
          </Flex>
        ))}
        {/* {items.length > 0 && label !== "Updates" && <Divider mt="4" />} */}
      </Flex>
    </Flex>
  ) : (
    <React.Fragment />
  );

const ComparisonResult = ({
  title,
  data,
}: {
  title: string;
  data: NormData;
}) => {
  const changeTypes = [
    {
      label: "Additions",
      color: systemColors.green[400],
      bgColor: systemColors.green[50],
      items: data.additions,
    },
    {
      label: "Deletions",
      color: systemColors.red[400],
      bgColor: systemColors.red[50],
      items: data.deletions,
      isStrikeThrough: true,
    },
    {
      label: "Updates",
      color: systemColors.orange[400],
      bgColor: systemColors.orange[50],
      items: data.updates,
    },
  ];

  const isEmpty =
    !changeTypes?.[0]?.items?.length &&
    !changeTypes?.[1]?.items?.length &&
    !changeTypes?.[2]?.items?.length;

  return !data || isEmpty ? (
    <></>
  ) : (
    <Flex
      p={6}
      borderWidth="1px"
      borderRadius="2xl"
      flexDir="column"
      gap={4}
      className="shadow-sm"
    >
      <Flex alignItems="center" gap="3">
        <TwoToneRuleIcon />
        <CustomText stylearr={[14, 20, 800]}>{title}</CustomText>
      </Flex>
      <Divider />
      <Flex flexDir="column" gap={4}>
        {changeTypes?.map(
          ({ label, color, bgColor, items, isStrikeThrough }) => (
            <ChangeType
              key={label}
              label={label}
              color={color}
              bgColor={bgColor}
              items={items}
              isStrikeThrough={isStrikeThrough}
            />
          )
        )}
      </Flex>
    </Flex>
  );
};

export default ComparisonResult;
