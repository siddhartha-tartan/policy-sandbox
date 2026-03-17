import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import CompareIcon from "../../../../../../assets/Icons/CompareIcon";
import HistoryOutlineIcon from "../../../../../../assets/Icons/HistoryOutlineIcon";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import ComparePolicyVersionsCta from "../../../../../common/ComparePolicy/components/ComparePolicyVersionsCta";
import useGetPolicyDetails from "../../../../../common/Policy/hooks/useGetPolicyDetails";
import { comparePolicyAtom } from "../../threadAtom";
import VersionBox from "./VersionBox";

export default function Versions() {
  const { policyId, categoryId, fileId } = useParams<{
    policyId: string;
    categoryId: string;
    fileId: string;
  }>();
  const [isCompareTab, setIsCompareTab] = useAtom(comparePolicyAtom);
  const { versionData } = useGetPolicyDetails(categoryId, policyId);
  const { isOpen, onOpen } = useDisclosure();
  const { data } = useGetPolicyDetails(categoryId, policyId);

  useLayoutEffect(() => {
    onOpen();
  }, []);

  const handleCompareSuccess = () => {
    setIsCompareTab(true);
  };

  return (
    <motion.div className="bg-white rounded-[12px] w-full gap-6 flex min-h-[50px] h-[50px] items-center overflow-y-auto justify-between">
      <div className="flex items-center h-full overflow-x-auto">
        <div className="flex gap-2 items-center h-full px-4 w-fit">
          <Box className="min-w-5 min-h-5">
            <HistoryOutlineIcon />
          </Box>
          <CustomText stylearr={[16, 22, 700]} noOfLines={1}>
            {data?.name || "Version History"}
          </CustomText>
        </div>
        <Flex className="h-full overflow-x-auto">
          {versionData?.length
            ? versionData
                ?.slice()
                .reverse()
                ?.map((row, id) => {
                  return (
                    <VersionBox
                      data={row}
                      key={`version-${row?.id}`}
                      isActive={row?.id === fileId}
                      id={id}
                    />
                  );
                })
            : Array.from({ length: 3 }, (_, id) => (
                <motion.div
                  key={`version-loading-${id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: id * 0.4, // Stagger animation
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className="w-full"
                >
                  <VersionBox isLoading isActive={id === 0} />
                </motion.div>
              ))}
        </Flex>
      </div>
      {isCompareTab ? (
        <motion.div
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <CustomButton
            variant="secondary"
            className="w-fit mx-auto font-bold text-sm border-none bg-white"
            onClick={() => {
              setIsCompareTab((prev) => !prev);
            }}
            leftIcon={<ChevronLeftIcon fontSize={"20px"} />}
          >
            <CustomText stylearr={[14, 20, 600]} noOfLines={2}>
              Rule Generation
            </CustomText>
          </CustomButton>
        </motion.div>
      ) : (
        <motion.div
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <ComparePolicyVersionsCta
            title={isOpen ? "Compare Versions" : "Compare"}
            isDisabled={versionData?.length < 2}
            useModal={true}
            versionData={versionData || []}
            onCompareSuccess={handleCompareSuccess}
            {...(isOpen ? { leftIcon: <CompareIcon /> } : {})}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
