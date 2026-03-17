import { Divider, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Provider, useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import CompareIcon from "../../../../assets/Icons/CompareIcon";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CommonSearchBar from "../../CommonSearchBar";
import { VersionHistoryItem } from "../../Policy/hooks/useGetPolicyDetails";
import { policyComparisonData } from "../atom";
import {
  NormData,
  useGetPolicyComparison,
} from "../hooks/useGetPolicyComparison";
import ComparisonResult from "./ComparisonResult";
import EmptyState from "./EmptyState";
import VersionSelection from "./VersionSelection";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
    },
  },
};

const MotionFlex = motion(Flex);

const PolicyComparisonTab = ({ data }: { data: VersionHistoryItem[] }) => {
  const [search, setSearch] = useState<string>("");
  const { data: comparisonData } = useGetPolicyComparison();
  const comparisonResult = useAtomValue(policyComparisonData) || comparisonData;

  const filteredComparisonResult = useMemo(() => {
    if (!search.trim() || !comparisonResult) return comparisonResult;

    const searchLower = search.toLowerCase();
    const filtered: typeof comparisonResult = {};

    Object.entries(comparisonResult || {}).forEach(([key, value]) => {
      const normValue = value as NormData;
      const matchesSearch = (item: any) =>
        JSON.stringify(item).toLowerCase().includes(searchLower);

      const filteredValue = {
        additions: normValue.additions?.filter(matchesSearch) || [],
        deletions: normValue.deletions?.filter(matchesSearch) || [],
        updates: normValue.updates?.filter(matchesSearch) || [],
      };

      if (
        filteredValue.additions.length ||
        filteredValue.deletions.length ||
        filteredValue.updates.length ||
        key.toLowerCase().includes(searchLower)
      ) {
        filtered[key] = filteredValue;
      }
    });

    return filtered;
  }, [search, comparisonResult]);

  const isEmpty =
    !filteredComparisonResult ||
    Object.values(filteredComparisonResult || {}).every((item: unknown) => {
      const typedItem = item as {
        additions?: any[];
        deletions?: any[];
        updates?: any[];
      };
      return !(
        typedItem?.additions?.length ||
        typedItem?.deletions?.length ||
        typedItem?.updates?.length
      );
    });

  return (
    <Provider>
      <Flex
        p={"24px"}
        bgColor={systemColors.white.absolute}
        borderRadius={"16px"}
        flexDir={"column"}
        overflowY={"scroll"}
        gap={"16px"}
        w={"full"}
        h={"full"}
      >
        <Flex justifyContent={"space-between"}>
          <Flex alignItems="center" gap={4}>
            <Flex gap={"10px"} alignItems={"center"}>
              <CompareIcon />
              <Text
                fontSize="14px"
                fontWeight="700"
                lineHeight={"22px"}
                color={systemColors.primary}
              >
                Version Comparison
              </Text>
            </Flex>
          </Flex>
          <VersionSelection data={data} />
        </Flex>
        <Divider />

        <motion.div
          key={`rule-list`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2, // Stagger animation
            duration: 0.3,
            ease: "easeOut",
          }}
          className="w-full h-full"
        >
          <CommonSearchBar
            flexGrow={1}
            handleChange={setSearch}
            placeholder={"Search"}
          />
          {isEmpty ? (
            <EmptyState />
          ) : (
            <MotionFlex
              className="p-[10px] flex-col gap-[10px]"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {Object.entries(filteredComparisonResult || {})?.map(
                ([key, value]) => (
                  <ComparisonResult
                    title={key}
                    data={value as NormData}
                    key={key}
                  />
                )
              )}
            </MotionFlex>
          )}
        </motion.div>
      </Flex>
    </Provider>
  );
};

export default PolicyComparisonTab;
