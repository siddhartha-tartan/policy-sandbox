import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { BsArrows } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import CompareIcon from "../../../../assets/Icons/CompareIcon";
import CustomButton from "../../../DesignSystem/CustomButton";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import { PolicyGenParamsEnum } from "../../../PolicyGen/pages/ThreadView/utils/constant";
import { VersionHistoryItem } from "../../Policy/hooks/useGetPolicyDetails";
import useGeneratePolicyComparison from "../hooks/useGeneratePolicyComparison";
import VersionDropdown from "./VersionDropdown";

const VersionSelection = ({ data }: { data: VersionHistoryItem[] }) => {
  const location = useLocation();
  const [baseId, setBaseId] = useState<string>("");
  const [compareId, setCompareId] = useState<string>("");

  useEffect(() => {
    setBaseId(
      new URLSearchParams(location.search).get(
        PolicyGenParamsEnum.BASE_FILE_ID
      )!
    );
    setCompareId(
      new URLSearchParams(location.search).get(
        PolicyGenParamsEnum.COMPARE_FILE_ID
      )!
    );
  }, [location]);

  const { mutate: compare, isLoading } = useGeneratePolicyComparison();

  // Convert version data to dropdown options with status information
  const allOptions = useMemo(() => {
    return (
      data?.map((item) => {
        const isSuccessful = item.status?.toLowerCase() === "successful";
        return {
          label: item.version,
          value: item.id,
          status: item.status,
          date: new Date(item.updated_at).toLocaleDateString("en-GB"),
          isDisabled: !isSuccessful,
        };
      }) || []
    );
  }, [data]);

  // Filter options for "From" dropdown (exclude selected "To" version)
  const baseOptions = useMemo(() => {
    return allOptions.filter((option) => option.value !== compareId);
  }, [allOptions, compareId]);

  // Filter options for "To" dropdown (exclude selected "From" version)
  const compareOptions = useMemo(() => {
    return allOptions.filter((option) => option.value !== baseId);
  }, [allOptions, baseId]);

  const handleCompare = () => {
    if (!baseId || !compareId) return;

    // Check if both selected versions are successful
    const baseVersion = allOptions.find((option) => option.value === baseId);
    const compareVersion = allOptions.find(
      (option) => option.value === compareId
    );

    if (baseVersion?.isDisabled || compareVersion?.isDisabled) {
      return; // Prevent comparison if either version is not successful
    }

    compare({ base_policy_file_id: baseId, compare_policy_file_id: compareId });
  };
  // Check if selected versions are valid for comparison
  const baseVersion = allOptions.find((option) => option.value === baseId);
  const compareVersion = allOptions.find(
    (option) => option.value === compareId
  );
  const isCompareDisabled =
    !baseId ||
    !compareId ||
    isLoading ||
    baseVersion?.isDisabled ||
    compareVersion?.isDisabled;

  return (
    <Flex gap={3} alignItems={"center"}>
      <Flex gap={"10px"} alignItems={"center"} key={"base-dropdown"}>
        <CustomText stylearr={[14, 22, 700]}>From</CustomText>
        <Box minW="150px">
          <VersionDropdown
            title=""
            options={baseOptions}
            value={baseId}
            onChange={setBaseId}
            placeholder="Select version"
          />
        </Box>
      </Flex>
      <BsArrows
        fontSize={"20px"}
        cursor={"pointer"}
        onClick={() => {
          const fileId = baseId;
          setBaseId(compareId);
          setCompareId(fileId);
        }}
      />
      <Flex gap={"10px"} alignItems={"center"} key={"compare-dropdown"}>
        <CustomText stylearr={[14, 22, 700]}>To</CustomText>
        <Box minW="150px">
          <VersionDropdown
            title=""
            options={compareOptions}
            value={compareId}
            onChange={setCompareId}
            placeholder="Select version"
          />
        </Box>
      </Flex>
      <CustomButton
        variant="tertiary"
        className="w-fit font-bold text-sm"
        leftIcon={<CompareIcon />}
        isDisabled={isCompareDisabled}
        onClick={handleCompare}
      >
        Compare
      </CustomButton>
    </Flex>
  );
};

export default VersionSelection;
