import { Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import useGetUserType from "../../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../../utils/constants/constants";
import { VersionHistoryItem } from "../../../../../common/Policy/hooks/useGetPolicyDetails";
import { POLICYGEN_SUB_ROUTES } from "../../../../../common/PolicyGen/utils/constants";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import AnimatedSkeleton from "../AnimatedSkeleton";

export default function VersionBox({
  isActive,
  isLoading = false,
  data,
  id,
}: {
  isActive: boolean;
  isLoading?: boolean;
  data?: VersionHistoryItem;
  id?: number;
}) {
  const navigate = useNavigate();
  const userType = useGetUserType();
  const { policyId, categoryId } = useParams<{
    policyId: string;
    categoryId: string;
  }>();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="flex h-full items-center"
      onClick={() => {
        if (data && !isActive && data?.id) {
          navigate(
            `${
              BASE_ROUTES[userType]
            }/policygen/${POLICYGEN_SUB_ROUTES.POLICY_DETAILS.replace(
              ":categoryId",
              categoryId!
            )
              .replace(":policyId", policyId!)
              .replace(":fileId", data?.id)}`
          );
        }
      }}
    >
      {isLoading ? (
        <AnimatedSkeleton className="h-full min-w-[106px] mx-2" />
      ) : (
        <Flex
          bgColor={isActive ? "rgba(0, 116, 255, 0.04)" : "#fff"}
          className={`h-full flex-col w-full border-l-[3px] cursor-pointer ${
            isActive ? "border-[#0074FF]" : "border-white"
          }`}
        >
          <Flex className="justify-between items-center gap-4 w-full h-full min-w-[106px]">
            <CustomText
              color={"#111827"}
              stylearr={[14, 20, 700]}
              className="text-center w-full"
            >
              Version {(id || 0) + 1}
            </CustomText>
          </Flex>
        </Flex>
      )}
    </motion.div>
  );
}
