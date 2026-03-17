import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState, memo } from "react";
import NoPolicySVG from "../../assets/Icons/NoPolicySVG";
import EventBus from "../../EventBus";
import { userStore } from "../../store/userStore";
import CustomCheckbox from "../CustomCheckbox";
import CustomButton from "../DesignSystem/CustomButton";
import CustomText from "../DesignSystem/Typography/CustomText";
import Status, { StatusTypes } from "./Status";
import { IS_HR_PORTAL } from "../../utils/constants/endpoints";
import { getHrPortalColorConfig } from "../../utils/getHrPortalColorConfig";
import useGetPoliciesByCategories from "../Polycraft/hooks/useGetPoliciesByCategories";
import CommonSearchBar from "./CommonSearchBar";
import CustomModal from "./CustomModal";
import MultiSelectDropdown from "./MultiSelect";

export const EVENT_OPEN_MULTIPLE_POLICY_SELECTION =
  "EVENT_OPEN_MULTIPLE_POLICY_SELECTION";

const MotionChevronIcon = memo(motion(ChevronDownIcon));

// Updated types to match PDF specification
type PolicyStatus = "active" | "processing" | "failed";

export interface PolicyVersion {
  id: string;
  version: string;
  status: PolicyStatus;
  createdAt: string; // ISO date string
}

export interface Policy {
  id: string;
  name: string;
  versions: PolicyVersion[];
}

export interface Category {
  id: string;
  name: string;
  policies: Policy[];
}

// Legacy interface for backward compatibility
export interface MultiplePolicySelection {
  id: string;
  policy_name: string;
  files: {
    id: string;
    file_name: string;
    version: number;
  };
}

// Helper function to map API status to PolicyStatus
const mapApiStatusToPolicyStatus = (apiStatus: string): PolicyStatus => {
  switch (apiStatus) {
    case "Successful":
      return "active";
    case "Processing":
      return "processing";
    case "Failed":
      return "failed";
    default:
      return "failed";
  }
};

// Helper function to determine latest version
const getLatestVersion = (policy: Policy): PolicyVersion => {
  return [...policy.versions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];
};

// Helper function to check if a policy version can be selected
const canSelectVersion = (version: PolicyVersion): boolean => {
  return version?.status === "active";
};

// Helper function to get selectable policies in a category
const getSelectablePolicies = (policies: Policy[]): Policy[] => {
  return policies.filter((policy) => {
    const latestVersion = getLatestVersion(policy);
    return canSelectVersion(latestVersion);
  });
};

// Removed unused function: validatePolicySelection

// Removed unused function: mapPolicyStatusToStatusType

// Get version status styling using existing color system
const getVersionStatusStyling = (status: PolicyStatus) => {
  switch (status) {
    case "active":
      return {
        textColor: "text-success-600",
        bgColor: "bg-success-50",
        borderColor: "border-success-100",
        statusType: StatusTypes.SUCCESS,
      };
    case "processing":
      return {
        textColor: "text-warning-600",
        bgColor: "bg-warning-50",
        borderColor: "border-warning-100",
        statusType: StatusTypes.PENDING,
      };
    case "failed":
      return {
        textColor: "text-error-600",
        bgColor: "bg-error-50",
        borderColor: "border-error-100",
        statusType: StatusTypes.FAILED,
      };
    default:
      return {
        textColor: "text-grey-600",
        bgColor: "bg-grey-50",
        borderColor: "border-grey-100",
        statusType: StatusTypes.INACTIVE,
      };
  }
};

export const MultiplePolicySelectionModal = memo(
  ({
    setSelectedPolicies,
    currentSelectedPolicies = null,
  }: {
    setSelectedPolicies: (policies: MultiplePolicySelection[]) => void;
    currentSelectedPolicies?: MultiplePolicySelection[] | null;
  }) => {
    const { loanCategories } = userStore();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const hrPortalColorConfig = getHrPortalColorConfig();
    const {
      data: policyDataByCategories,
      search,
      setSearch,
      setCategoryIds,
    } = useGetPoliciesByCategories();

    // Enhanced state management as per PDF specification
    const [selectedPolicies, setSelectedPoliciesState] = useState<
      Record<string, string>
    >({});
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [shakingCategoryId, setShakingCategoryId] = useState<string | null>(
      null
    );
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
      new Set<string>()
    );
    const [openPopovers, setOpenPopovers] = useState<Set<string>>(new Set());
    // Removed unused shimmerPolicies state

    // Transform API data to match PDF specification - memoized for performance
    const transformedCategories: Category[] = useMemo(
      () =>
        policyDataByCategories?.map((category) => ({
          id: category.category_id,
          name: category.category_name,
          policies: category.policies.map((policy) => ({
            id: policy.id,
            name: policy.policy_name,
            versions: policy.files.map((file) => ({
              id: file.id,
              version: `${file.version}`,
              status: mapApiStatusToPolicyStatus(file.status),
              createdAt: new Date().toISOString(), // API doesn't provide this, using current time
            })),
          })),
        })) || [],
      [policyDataByCategories]
    );

    // Initialize state from current selected policies
    useEffect(() => {
      if (currentSelectedPolicies?.length) {
        const newSelectedPolicies: Record<string, string> = {};
        currentSelectedPolicies.forEach((policy) => {
          newSelectedPolicies[policy.id] = policy.files?.id || "";
        });
        setSelectedPoliciesState(newSelectedPolicies);
      }
    }, []);

    // Enhanced handler functions as per PDF specification - memoized for performance
    const handleCategorySelect = useCallback(
      (category: Category) => {
        const validPolicies = getSelectablePolicies(category.policies);

        if (validPolicies.length === 0) {
          // Trigger shake animation for invalid bulk selection
          setShakingCategoryId(category.id);
          setTimeout(() => setShakingCategoryId(null), 400);
          return;
        }

        const allValidSelected = validPolicies.every(
          (policy) => selectedPolicies[policy.id]
        );

        if (allValidSelected) {
          // Deselect all valid policies in category
          const newSelected = { ...selectedPolicies };
          validPolicies.forEach((policy) => {
            delete newSelected[policy.id];
          });
          setSelectedPoliciesState(newSelected);
        } else {
          // Select all valid policies with their latest versions
          const newSelected = { ...selectedPolicies };
          validPolicies.forEach((policy) => {
            const latestVersion = getLatestVersion(policy);
            newSelected[policy.id] = latestVersion?.id || "";
          });
          setSelectedPoliciesState(newSelected);
        }
      },
      [selectedPolicies]
    );

    const handlePolicyToggle = useCallback(
      (policy: Policy) => {
        if (selectedPolicies[policy.id]) {
          // Remove from selection
          const newSelected = { ...selectedPolicies };
          delete newSelected[policy.id];
          setSelectedPoliciesState(newSelected);
        } else {
          // Add to selection if latest version is active
          const latestVersion = getLatestVersion(policy);
          if (canSelectVersion(latestVersion)) {
            setSelectedPoliciesState((prev) => ({
              ...prev,
              [policy.id]: latestVersion?.id || "",
            }));
          }
        }
      },
      [selectedPolicies]
    );

    // Popover management - memoized for performance
    const togglePopover = useCallback((policyId: string) => {
      setOpenPopovers((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(policyId)) {
          newSet.delete(policyId);
        } else {
          newSet.add(policyId);
        }
        return newSet;
      });
    }, []);

    const closePopover = useCallback((policyId: string) => {
      setOpenPopovers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(policyId);
        return newSet;
      });
    }, []);

    const handleVersionChange = useCallback(
      (policy: Policy, versionId: string) => {
        const version = policy.versions.find((v) => v.id === versionId);
        if (!version) return;

        if (version?.status === "processing" || version?.status === "failed") {
          // Auto-deselect policy for invalid versions
          const newSelected = { ...selectedPolicies };
          delete newSelected[policy.id];
          setSelectedPoliciesState(newSelected);
        } else {
          // Select policy with this specific version
          setSelectedPoliciesState((prev) => ({
            ...prev,
            [policy.id]: versionId,
          }));
        }
        closePopover(policy.id);
      },
      [selectedPolicies, closePopover]
    );

    const isPopoverOpen = useCallback(
      (policyId: string) => openPopovers.has(policyId),
      [openPopovers]
    );

    // Category expansion with shimmer effect - memoized for performance
    const toggleCategoryExpansion = useCallback((categoryId: string) => {
      setExpandedCategories((prev) => {
        const isExpanding = !prev.includes(categoryId);

        if (isExpanding) {
          return [...prev, categoryId];
        } else {
          return prev.filter((id) => id !== categoryId);
        }
      });
    }, []);

    // Update parent component when selection changes
    useEffect(() => {
      if (!transformedCategories.length) return;

      const selectedPoliciesArray = Object.entries(selectedPolicies)
        .map(([policyId, versionId]) => {
          const category = transformedCategories.find((cat) =>
            cat.policies.some((policy) => policy.id === policyId)
          );
          const policy = category?.policies.find((p) => p.id === policyId);
          const version = policy?.versions.find((v) => v.id === versionId);

          if (policy && version) {
            return {
              id: policy.id,
              policy_name: policy.name,
              files: {
                id: version.id,
                version: parseInt(version.version),
              },
            };
          }
          return null;
        })
        .filter(Boolean) as MultiplePolicySelection[];

      setSelectedPolicies(selectedPoliciesArray);
    }, [selectedPolicies, transformedCategories]);

    // Helper functions for category state - memoized for performance
    const getCategorySelectionState = useCallback(
      (category: Category) => {
        const selectablePolicies = getSelectablePolicies(category.policies);
        const selectedCount = selectablePolicies.filter(
          (policy) => selectedPolicies[policy.id]
        ).length;

        if (selectedCount === 0)
          return { isChecked: false, isIndeterminate: false };
        if (selectedCount === selectablePolicies.length)
          return { isChecked: true, isIndeterminate: false };
        return { isChecked: false, isIndeterminate: true };
      },
      [selectedPolicies]
    );

    // Memoized animation variants for better performance
    const categoryVariants = useMemo(
      () => ({
        initial: { opacity: 0, y: 2 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.15 },
      }),
      []
    );

    const policyVariants = useMemo(
      () => ({
        initial: { opacity: 0, x: -5 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.15 },
      }),
      []
    );

    // Event listeners
    useEffect(() => {
      EventBus.getInstance().addListener(
        EVENT_OPEN_MULTIPLE_POLICY_SELECTION,
        onOpen
      );
      return () => EventBus.getInstance().removeListener(onOpen);
    }, []);

    // Optimized scroll handler with throttling
    const handleScroll = useCallback(() => {
      if (openPopovers.size > 0) {
        setOpenPopovers(new Set());
      }
    }, [openPopovers.size]);

    useEffect(() => {
      if (isOpen) {
        document.addEventListener("scroll", handleScroll, true);
        window.addEventListener("scroll", handleScroll);
      }

      return () => {
        document.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("scroll", handleScroll);
      };
    }, [isOpen, handleScroll]);

    // Removed unused animation variants

    return (
      <CustomModal w={"663px"} h={"540px"} isOpen={isOpen} onClose={onClose}>
        <Flex className="flex flex-col h-[540px] w-[663px] justify-between">
          {/* Header */}
          <div className="flex flex-row h-[60px] border-b px-5 w-full justify-between items-center">
            <CustomText stylearr={[16, 20, 600]}>Select Policy</CustomText>
            <CloseIcon
              onClick={onClose}
              className="cursor-pointer text-[12px]"
              style={{
                color: IS_HR_PORTAL ? hrPortalColorConfig.textMuted : "#555557",
              }}
            />
          </div>

          {/* Content */}
          <div className="flex p-4 flex-col grow overflow-y-auto">
            {/* Search and Filter */}
            <div className="flex flex-row gap-4">
              <CommonSearchBar
                handleChange={setSearch}
                className="bg-white w-[60%]"
                h={"46px"}
                placeholder="Search..."
              />
              <MultiSelectDropdown
                options={loanCategories?.map((row) => ({
                  label: row?.category_type,
                  value: row?.id,
                }))}
                value={Array.from(selectedCategories)}
                onChange={(e) => {
                  setSelectedCategories(new Set(e));
                  setCategoryIds(new Set(e));
                }}
                className="w-[40%] h-[46px]"
                placeholder="Category"
              />
            </div>

            {/* Policy Categories */}
            <div className="flex flex-col w-full gap-3 h-full overflow-y-auto">
              <h3
                className="text-sm font-semibold mt-4 text-gray-500"
                style={{
                  color: IS_HR_PORTAL
                    ? hrPortalColorConfig.textMuted
                    : "#555557",
                }}
              >
                {search ? "Search Results" : "Recent Policies"}
              </h3>

              <div className="overflow-y-auto h-[330px]">
                {!transformedCategories?.length ? (
                  <div className="h-[258px] flex justify-center items-center">
                    <div className="flex flex-col justify-center items-center gap-6">
                      <NoPolicySVG />
                      <p className="font-semibold text-gray-600 mt-2">
                        No policy
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {transformedCategories.map((category) => {
                      const categoryState = getCategorySelectionState(category);
                      const selectablePolicies = getSelectablePolicies(
                        category.policies
                      );

                      return (
                        <motion.div key={category.id} {...categoryVariants}>
                          {/* Category Header - Simplified with CSS animation */}
                          <div
                            onClick={() => toggleCategoryExpansion(category.id)}
                            className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors mb-2 ${
                              shakingCategoryId === category.id
                                ? "animate-pulse"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span onClick={(e) => e.stopPropagation()}>
                                <CustomCheckbox
                                  isChecked={categoryState.isChecked}
                                  isIndeterminate={
                                    categoryState.isIndeterminate
                                  }
                                  isDisabled={selectablePolicies.length === 0}
                                  color={
                                    IS_HR_PORTAL
                                      ? hrPortalColorConfig.primary
                                      : "#176FC1"
                                  }
                                  setIsChecked={() =>
                                    handleCategorySelect(category)
                                  }
                                />
                              </span>
                              <CustomText stylearr={[14, 18, 600]}>
                                {category.name}
                              </CustomText>
                              <CustomText
                                stylearr={[12, 18, 400]}
                                color="#98A2B3"
                              >
                                {category.policies.length} Policies
                              </CustomText>
                            </div>
                            <MotionChevronIcon
                              animate={{
                                rotate: expandedCategories.includes(category.id)
                                  ? 180
                                  : 0,
                              }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>

                          {/* Policies List - Always show when expanded */}
                          {expandedCategories.includes(category.id) && (
                            <div className="ml-6 border-l-2 border-orange-200 pl-4 space-y-2">
                              {category.policies.map((policy, index) => (
                                <PolicyItem
                                  key={policy.id}
                                  policy={policy}
                                  index={index}
                                  selectedPolicies={selectedPolicies}
                                  handlePolicyToggle={handlePolicyToggle}
                                  handleVersionChange={handleVersionChange}
                                  togglePopover={togglePopover}
                                  closePopover={closePopover}
                                  isPopoverOpen={isPopoverOpen}
                                  policyVariants={policyVariants}
                                  hrPortalColorConfig={hrPortalColorConfig}
                                />
                              ))}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex flex-row justify-between h-[80px] p-4 items-center"
            style={{
              backgroundColor: IS_HR_PORTAL
                ? hrPortalColorConfig.conversationBg
                : "#FAFAFA",
            }}
          >
            {Object.keys(selectedPolicies).length > 0 ? (
              <CustomText stylearr={[14, 18, 600]}>
                {Object.keys(selectedPolicies).length} Policies Selected
              </CustomText>
            ) : (
              <div />
            )}
            <div className="flex flex-row gap-[10px]">
              <CustomButton
                variant="secondary"
                fontSize={"14px"}
                onClick={() => {
                  setSelectedPoliciesState({});
                  onClose();
                }}
              >
                Cancel
              </CustomButton>
              <CustomButton
                fontSize={"14px"}
                variant="quaternary"
                onClick={onClose}
              >
                Confirm Selection ({Object.keys(selectedPolicies).length})
              </CustomButton>
            </div>
          </div>
        </Flex>
      </CustomModal>
    );
  }
);

// Memoized PolicyItem component for better performance
const PolicyItem = memo(
  ({
    policy,
    index,
    selectedPolicies,
    handlePolicyToggle,
    handleVersionChange,
    togglePopover,
    closePopover,
    isPopoverOpen,
    policyVariants,
    hrPortalColorConfig,
  }: {
    policy: Policy;
    index: number;
    selectedPolicies: Record<string, string>;
    handlePolicyToggle: (policy: Policy) => void;
    handleVersionChange: (policy: Policy, versionId: string) => void;
    togglePopover: (policyId: string) => void;
    closePopover: (policyId: string) => void;
    isPopoverOpen: (policyId: string) => boolean;
    policyVariants: any;
    hrPortalColorConfig: any;
  }) => {
    const latestVersion = getLatestVersion(policy);
    const selectedVersion =
      policy.versions.find((v) => v.id === selectedPolicies[policy.id]) ||
      latestVersion;
    const isSelected = !!selectedPolicies[policy.id];
    const canSelect = canSelectVersion(latestVersion);
    const statusStyling = getVersionStatusStyling(latestVersion?.status || "");

    return (
      <motion.div
        key={policy.id}
        {...policyVariants}
        transition={{
          ...policyVariants.transition,
          delay: index * 0.02,
        }}
        className="flex items-center justify-between py-2 px-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div
          className="flex items-center gap-3 cursor-pointer flex-1"
          onClick={() => handlePolicyToggle(policy)}
        >
          <CustomCheckbox
            isChecked={isSelected}
            isDisabled={!canSelect}
            color={IS_HR_PORTAL ? hrPortalColorConfig.primary : "#176FC1"}
            setIsChecked={() => handlePolicyToggle(policy)}
          />
          <div className="flex items-center gap-2">
            <CustomText stylearr={[14, 18, 500]}>{policy.name}</CustomText>
            {latestVersion?.status !== "active" && (
              <Status
                status={statusStyling.statusType}
                w="auto"
                minW="auto"
                className="px-2 py-1 h-auto text-xs"
              />
            )}
          </div>
        </div>

        {/* Version Dropdown - Simplified */}
        <div className="relative">
          <Popover
            isOpen={isPopoverOpen(policy.id)}
            onClose={() => closePopover(policy.id)}
            placement="bottom-end"
            closeOnBlur={true}
            closeOnEsc={true}
          >
            <PopoverTrigger>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  togglePopover(policy.id);
                }}
              >
                <Flex className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  <CustomText stylearr={[12, 16, 500]} color="#475467">
                    V{selectedVersion?.version}
                  </CustomText>
                  <MotionChevronIcon
                    animate={{
                      rotate: isPopoverOpen(policy.id) ? 180 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    fontSize="12px"
                  />
                </Flex>
              </span>
            </PopoverTrigger>

            <Portal>
              <PopoverContent
                className="border border-gray-200 p-1 m-0 w-auto min-w-[120px] rounded-lg shadow-lg focus-visible:ring-0"
                maxH="150px"
                overflowY="auto"
              >
                <VStack spacing={0} className="w-full">
                  {policy.versions.map((version) => {
                    const versionStyling = getVersionStatusStyling(
                      version.status
                    );
                    return (
                      <Flex
                        key={version.id}
                        className="w-full justify-between items-center cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVersionChange(policy, version.id);
                        }}
                      >
                        <CustomText stylearr={[12, 16, 500]} color="#475467">
                          V{version.version}
                        </CustomText>
                        <Status
                          status={versionStyling.statusType}
                          w="auto"
                          minW="auto"
                          className="px-1 py-0.5 h-auto text-xs ml-2"
                        />
                      </Flex>
                    );
                  })}
                </VStack>
              </PopoverContent>
            </Portal>
          </Popover>
        </div>
      </motion.div>
    );
  }
);

PolicyItem.displayName = "PolicyItem";

// Add display name for debugging
MultiplePolicySelectionModal.displayName = "MultiplePolicySelectionModal";
