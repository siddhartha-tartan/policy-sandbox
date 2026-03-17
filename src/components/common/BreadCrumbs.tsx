import { Flex } from "@chakra-ui/layout";
import { FlexProps } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";

export interface BREAD_CRUMB_PROPS {
  label: string;
  navigateTo?: string;
}

interface IProps extends FlexProps {
  data: BREAD_CRUMB_PROPS[];
}

export default function BreadCrumbs({ data, ...props }: IProps) {
  const navigate = useNavigate();
  if (data?.length <= 1) return <></>;
  return (
    <Flex gridGap="6px" alignItems="center" userSelect="none" {...props}>
      {data?.map((row, index) => {
        if (index == data?.length - 1)
          return (
            <CustomText
              stylearr={[14, 22, 700]}
              className="capitalize"
              key={index}
              color={"#455A64"}
            >
              {row?.label?.toLowerCase()}
            </CustomText>
          );
        return (
          <Flex
            key={index}
            gridGap="6px"
            alignItems="center"
            color={systemColors.black[600]}
          >
            <CustomText
              stylearr={[14, 22, 500]}
              color={"#90A4AE"}
              cursor="pointer"
              key={index}
              className="capitalize"
              onClick={() => {
                navigate(row?.navigateTo || "");
              }}
            >
              {row?.label?.toLowerCase()}
            </CustomText>
            <Flex w="10px" h="10px" alignItems="center" justifyContent="center">
              /
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
}
