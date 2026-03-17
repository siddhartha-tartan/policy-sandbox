import { Flex } from "@chakra-ui/react";
import { BsPatchCheck } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../../../components/common/CustomModal";
import { systemColors } from "../../../../components/DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../components/DesignSystem/CustomButton";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";
import { BASE_ROUTES } from "../../../../utils/constants/constants";
interface IProps {
  isOpen: boolean;
  onClose: () => void;
  numberOfEmployee: number;
}
export default function AssignmentScheduledModal({
  isOpen,
  onClose,
  //@ts-ignore
  numberOfEmployee,
}: IProps) {
  const navigate = useNavigate();
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <Flex
        flexDir="column"
        p="24px"
        borderRadius="12px"
        w="500px"
        gap="32px"
        justifyContent="center"
        alignItems="center"
      >
        <Flex
          gap={"20px"}
          w={"full"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDir={"column"}
        >
          <Flex
            w={"66px"}
            justifyContent={"center"}
            alignItems={"center"}
            borderRadius={"999px"}
            h="66px"
            bgColor={systemColors.success[100]}
          >
            <Flex
              w={"46px"}
              borderRadius={"999px"}
              justifyContent={"center"}
              alignItems={"center"}
              h="46px"
              bgColor={systemColors.success[50]}
            >
              <BsPatchCheck
                color={systemColors.success[600]}
                fontSize={"36px"}
              />
            </Flex>
          </Flex>
          <Flex flexDir={"column"} gap={2}>
            <CustomText stylearr={[18, 20, 700]}>
              Assignment Scheduled successfully
            </CustomText>
            <CustomText
              textAlign={"center"}
              color={systemColors.grey[600]}
              stylearr={[14, 20, 500]}
            >
              {/* Assignment send to {numberOfEmployee} employees */}
              Assignment sent to selected employees
            </CustomText>
          </Flex>
        </Flex>
        <Flex w="full" gap="24px">
          <CustomButton
            borderRadius="8px"
            borderColor={systemColors.black[200]}
            variant="tertiary"
            flex={1}
            fontWeight={"16px"}
            onClick={() => {
              onClose();
              navigate("/");
            }}
          >
            Take me to dashboard
          </CustomButton>
          <CustomButton
            bgColor={systemColors.grey[900]}
            borderRadius="8px"
            fontWeight={"16px"}
            flex={1}
            onClick={() => {
              navigate(`${BASE_ROUTES.SPOC}/assessment`);
            }}
          >
            Okay
          </CustomButton>
        </Flex>
      </Flex>
    </CustomModal>
  );
}
