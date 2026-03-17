import { Divider, Flex } from "@chakra-ui/react";
import { systemColors } from "../../../../components/DesignSystem/Colors/SystemColors";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";

const data = [
  { title: "Auto Loan Policy", attestedBy: 15, total: 30, id: "1" },
  { title: "Loan Policy", attestedBy: 15, total: 30, id: "2" },
  { title: "Collateral Policy", attestedBy: 15, total: 30, id: "3" },
];

const RecentAttestations = () => {
  return (
    <Flex className="flex-col">
      <Flex className="justify-between py-3 px-[6px]">
        <CustomText stylearr={[14, 18, 500]} color={systemColors.black[600]}>
          Name
        </CustomText>
        <CustomText stylearr={[14, 18, 500]} color={systemColors.black[600]}>
          Action
        </CustomText>
      </Flex>
      <Divider />
      {data?.map((item) => (
        <Flex
          key={`attestation-${item.id}`}
          className="justify-between py-3 px-[6px]"
        >
          <Flex className="flex-col gap-2">
            <CustomText stylearr={[14, 18, 600]}>{item.title}</CustomText>
            <CustomText
              stylearr={[12, 16, 500]}
            >{`Attested By: ${item.attestedBy}/${item.total}`}</CustomText>
          </Flex>
          <Flex>
            <Flex
              className="px-[14px] py-[10px] w-fit rounded-lg items-center cursor-pointer"
              background={systemColors.orange[50]}
            >
              <CustomText
                stylearr={[14, 14, 600]}
                color={systemColors.orange[600]}
              >
                Remind
              </CustomText>
            </Flex>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};

export default RecentAttestations;
