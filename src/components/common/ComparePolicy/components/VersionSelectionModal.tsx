import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { BsArrows } from "react-icons/bs";
import CompareIcon from "../../../../assets/Icons/CompareIcon";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../DesignSystem/CustomButton";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import { VersionHistoryItem } from "../../Policy/hooks/useGetPolicyDetails";
import useGeneratePolicyComparison from "../hooks/useGeneratePolicyComparison";
import VersionDropdown from "./VersionDropdown";

interface VersionOption {
  label: string;
  value: string;
  status: string;
  date: string;
  isDisabled: boolean;
}

interface VersionSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  versionData: VersionHistoryItem[];
  onCompareSuccess?: () => void;
}

const VersionSelectionModal = ({
  isOpen,
  onClose,
  versionData,
  onCompareSuccess,
}: VersionSelectionModalProps) => {
  const [fromVersion, setFromVersion] = useState<string>("");
  const [toVersion, setToVersion] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: compare } = useGeneratePolicyComparison(() => {
    onCompareSuccess?.();
    onClose();
  });

  // Convert version data to dropdown options
  const allOptions: VersionOption[] = useMemo(() => {
    return (
      versionData?.map((item) => {
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
  }, [versionData]);

  // Filter options for "From" dropdown (exclude selected "To" version)
  const fromOptions = useMemo(() => {
    return allOptions.filter((option) => option.value !== toVersion);
  }, [allOptions, toVersion]);

  // Filter options for "To" dropdown (exclude selected "From" version)
  const toOptions = useMemo(() => {
    return allOptions.filter((option) => option.value !== fromVersion);
  }, [allOptions, fromVersion]);

  const handleSwapVersions = () => {
    const tempFrom = fromVersion;
    setFromVersion(toVersion);
    setToVersion(tempFrom);
  };

  const handleCompare = () => {
    if (!fromVersion || !toVersion) return;
    setIsLoading(true);
    compare(
      {
        base_policy_file_id: fromVersion,
        compare_policy_file_id: toVersion,
      },
      {
        onSuccess: (data) => {
          if (data) {
            if (data?.status !== "Pending") {
              setIsLoading(false);
            }
          }
        },
      },
    );
  };

  const handleCancel = () => {
    setFromVersion("");
    setToVersion("");
    onClose();
  };

  const isCompareDisabled = !fromVersion || !toVersion || isLoading;

  // Get selected version details for validation
  const getVersionDetails = (versionId: string) => {
    return allOptions.find((option) => option.value === versionId);
  };

  const fromVersionDetails = getVersionDetails(fromVersion);
  const toVersionDetails = getVersionDetails(toVersion);

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent borderRadius="16px" p={0}>
        <ModalHeader pb={2}>
          <CustomText stylearr={[20, 28, 600]} color={systemColors.grey[900]}>
            Compare Versions
          </CustomText>
          <CustomText
            stylearr={[14, 20, 400]}
            color={systemColors.grey[600]}
            mt={1}
          >
            Select two versions to compare side by side.
          </CustomText>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {/* From Version Selection */}
            <VersionDropdown
              title="From"
              options={fromOptions}
              value={fromVersion}
              onChange={setFromVersion}
              placeholder="Select version"
            />

            {/* Swap Button */}
            <Flex justifyContent="center">
              <Box
                as="button"
                onClick={handleSwapVersions}
                p={2}
                borderRadius="8px"
                _hover={{ bg: systemColors.grey[100] }}
                transition="all 0.2s"
                disabled={!fromVersion || !toVersion}
              >
                <BsArrows fontSize="20px" color={systemColors.grey[600]} />
              </Box>
            </Flex>

            {/* To Version Selection */}
            <VersionDropdown
              title="To"
              options={toOptions}
              value={toVersion}
              onChange={setToVersion}
              placeholder="Select version"
            />

            {/* Warning message for non-successful versions */}
            {(fromVersionDetails?.status !== "Successful" ||
              toVersionDetails?.status !== "Successful") &&
              fromVersion &&
              toVersion && (
                <Box
                  bg="orange.50"
                  border="1px solid"
                  borderColor="orange.200"
                  borderRadius="8px"
                  p={3}
                >
                  <Text fontSize="12px" color="orange.700" fontWeight="500">
                    ⚠️ Comparison is only available for versions with "Success"
                    status.
                  </Text>
                </Box>
              )}

            {/* Action Buttons */}
            <Flex gap={3} pt={4}>
              <CustomButton
                variant="secondary"
                onClick={handleCancel}
                flex={1}
                isDisabled={isLoading}
              >
                Cancel
              </CustomButton>
              <CustomButton
                variant="primary"
                onClick={handleCompare}
                flex={1}
                leftIcon={<CompareIcon />}
                isDisabled={isCompareDisabled}
                isLoading={isLoading}
                loadingText="Comparing..."
              >
                Compare
              </CustomButton>
            </Flex>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VersionSelectionModal;
