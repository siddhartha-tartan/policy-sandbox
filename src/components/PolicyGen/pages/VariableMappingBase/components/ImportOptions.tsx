import { CloseButton, Flex } from "@chakra-ui/react";
import { UserCommunity } from "react-huge-icons/outline";
import { LuCode2 } from "react-icons/lu";
import { PiFileCsvLight } from "react-icons/pi";
import CustomText from "../../../../DesignSystem/Typography/CustomText";

const ImportOptions = ({
  onSelect,
  onClose,
}: {
  onSelect: () => void;
  onClose: () => void;
}) => {
  return (
    <Flex className="flex-col gap-6 w-[517px] p-6">
      <Flex className="flex-row justify-between items-center">
        <CustomText stylearr={[20, 32, 700]}>
          Import destination variables
        </CustomText>
        <CloseButton onClick={onClose} />
      </Flex>
      <Flex className="flex-col gap-4 w-full">
        <Flex
          className="h-[90px] px-6 flex-row gap-3 items-center border rounded-[12px] cursor-pointer"
          _hover={{
            transition: "all 250ms ease-out",
            background: "#F5F9FF",
          }}
          onClick={onSelect}
        >
          <PiFileCsvLight
            fontSize={"28px"}
            color="#0074FF"
            style={{ background: "#F5F9FF", borderRadius: "6px" }}
          />
          <CustomText stylearr={[14, 21, 600]}>From CSV</CustomText>
        </Flex>
        <Flex className="h-[90px] px-6 flex-col gap-4 justify-center  border rounded-[12px] cursor-pointer">
          <CustomText stylearr={[12, 18, 600]} color="#0074FF">
            Coming Soon
          </CustomText>
          <Flex className="flex-row gap-3 items-center">
            <LuCode2
              fontSize={"22px"}
              color="#0074FF"
              style={{ background: "#F5F9FF", borderRadius: "6px" }}
            />
            <CustomText stylearr={[14, 21, 600]}>From Code</CustomText>
          </Flex>
        </Flex>
        <Flex className="h-[90px] px-6 flex-col gap-4 justify-center  border rounded-[12px] cursor-pointer">
          <CustomText stylearr={[12, 18, 600]} color="#0074FF">
            Coming Soon
          </CustomText>
          <Flex className="flex-row gap-3 items-center">
            <UserCommunity
              fontSize={"22px"}
              color="#0074FF"
              style={{ background: "#F5F9FF", borderRadius: "6px" }}
            />
            <CustomText stylearr={[14, 21, 600]}>Integrate with CRM</CustomText>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ImportOptions;
