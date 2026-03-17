import { Divider, Flex } from "@chakra-ui/react";
import { formatDate } from "../../../../../utils/helpers/formatDate";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { PolicyDetails } from "../../hooks/useGetPolicyDetails";

const PolicyInfoBox = ({ data }: { data: PolicyDetails }) => {
  const config = [
    {
      label: "Policy Name",
      value: data?.name,
    },
    {
      label: "Key Highlights",
      value: data?.description,
    },
    {
      label: "Product Category:",
      value: data?.loan_category,
    },
    {
      label: "Status",
      value: data?.published_on
        ? `Published - ${formatDate(new Date(data.published_on))}`
        : "-",
    },
    {
      label: "Policy Owner",
      value: data?.owner,
    },
  ];

  return (
    <Flex
      p="24px"
      flexDir={"column"}
      gap={"30px"}
      h={"fit-content"}
      w="307px"
      minW="307px"
      maxW="307px"
    >
      <Flex className="w-full items-center gap-[60px]">
        <CustomText
          stylearr={[20, 26, 700]}
          color={systemColors.black.absolute}
        >
          Info
        </CustomText>
      </Flex>
      <Divider />
      {config?.map((row, id) => (
        <Flex key={id} flexDir={"column"} gap={4}>
          <CustomText stylearr={[12, 15, 700]} color={systemColors.black[400]}>
            {row.label}
          </CustomText>
          <CustomText stylearr={[14, 18, 500]} color={systemColors.black[800]}>
            {row.value}
          </CustomText>
        </Flex>
      ))}
    </Flex>
  );
};

export default PolicyInfoBox;
