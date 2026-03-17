import { Flex, StackDivider, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ILoanCategory } from "../../../hooks/useGetLoanCategories";
import useGetUserType from "../../../hooks/useGetUserType";
import { POLICY_ROUTES } from "../../../utils/constants/constants";
import {
  abflColors,
  systemColors,
} from "../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../DesignSystem/CustomButton";
import CustomText from "../../DesignSystem/Typography/CustomText";
import Badge from "../Badge";
import { IS_HR_PORTAL, isAbfl } from "../../../utils/constants/endpoints";
import { getHrPortalColorConfig } from "../../../utils/getHrPortalColorConfig";
const MotionVStack = motion(VStack);
export default function PolicyBox({ data }: { data: ILoanCategory }) {
  const hrPortalColorConfig = getHrPortalColorConfig();
  const navigate = useNavigate();
  const userType = useGetUserType();
  return (
    <MotionVStack
      p={"24px"}
      borderWidth={"1px"}
      gap={4}
      borderColor={systemColors.grey[200]}
      borderRadius={"16px"}
      flexDir={"column"}
      divider={<StackDivider borderColor={"rgba(0, 0, 0, 0.08)"} />}
      bg="white"
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.03)"
      whileHover={{
        scale: 1.01,
        boxShadow: "0px 8px 10px rgba(0, 0, 0, 0.05)",
        transition: { duration: 0.3 },
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Flex
        gap={"10px"}
        justifyContent={"center"}
        flexDir={"column"}
        w="full"
        alignItems={"center"}
      >
        <CustomText
          textAlign={"center"}
          stylearr={[22, 30, 800]}
          color={systemColors.grey[900]}
        >
          {data?.category_type}
        </CustomText>
        <Badge
          w="200px"
          borderRadius={"16px"}
          bgColor={
            IS_HR_PORTAL
              ? hrPortalColorConfig.conversationBgHover
              : isAbfl
              ? abflColors.secondary
              : systemColors.indigo[50]
          }
          color={
            IS_HR_PORTAL
              ? hrPortalColorConfig.primary
              : isAbfl
              ? abflColors.primary
              : systemColors.indigo[600]
          }
          fontSize={"14px"}
          fontWeight={600}
          text={`${data?.policy?.count || 0} total policies`}
        />
      </Flex>
      <Flex gap={4} w="full" flexDir={"column"}>
        <CustomButton
          borderColor={systemColors.black[200]}
          fontSize={"12px"}
          fontWeight={600}
          color={systemColors.black[900]}
          onClick={() => {
            navigate(`${POLICY_ROUTES[userType]}/${data?.id}`);
          }}
          variant="tertiary"
          _hover={{
            bg: systemColors.indigo[50],
            color: systemColors.indigo[600],
            transition: "all 0.3s",
          }}
        >
          View
        </CustomButton>
      </Flex>
    </MotionVStack>
  );
}
