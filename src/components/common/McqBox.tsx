import { Flex, Text } from "@chakra-ui/react";
import { Tick } from "react-huge-icons/solid";
import { IOption } from "../../dashboards/Spoc/Assessment/pages/IndivisualAssesment/hooks/useGetAssesment";
import CustomCheckbox from "../CustomCheckbox";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import Badge from "./Badge";

export interface McqBoxProps {
  question: string;
  options: IOption[];
  correct_answer?: string;
  index?: number;
  value?: string;
  onChange?: null | ((selected: string) => void);
}

export default function McqBox({
  question,
  options,
  correct_answer = "",
  index = 1,
  value = "",
  onChange = null,
}: McqBoxProps) {
  return (
    <Flex
      p={6}
      bgColor={systemColors.white.absolute}
      borderLeftWidth={"4px"}
      borderColor={systemColors.black[900]}
      borderRadius={"16px"}
      gap={6}
      w="full"
      flexDir="column"
    >
      <Text fontSize="14px" fontWeight={500} color={systemColors.black[900]}>
        {index}- {question}
      </Text>
      <Flex gap="20px" flexDir="column">
        {options.map((row, id) => (
          <Flex key={id} gap="20px" alignItems="center">
            <CustomCheckbox
              cursor={onChange ? "pointer" : "initial"}
              label={row.label}
              isChecked={value === row.value}
              setIsChecked={() => onChange && onChange(row?.value)}
            />
            {correct_answer === row.value && (
              <Badge
                bgColor={systemColors.green[50]}
                color={systemColors.green[500]}
                w="177px"
                text="Correct Answer"
                leftIcon={<Tick fontSize={"20px"} />}
              />
            )}
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
