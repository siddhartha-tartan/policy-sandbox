import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  StackDivider,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { Value } from "react-calendar/dist/esm/shared/types.js";
import { Filter } from "react-huge-icons/outline";
import EventBus from "../../../../../../EventBus";
import {
  Feature,
  LOCAL_STORAGE_FEATURE_LIST_KEY,
} from "../../../../../../hooks/useGetFeatures";
import { userStore } from "../../../../../../store/userStore";
import {
  FeatureIdentifiers,
  UserType,
} from "../../../../../../utils/constants/constants";
import { IS_HR_PORTAL } from "../../../../../../utils/constants/endpoints";
import {
  getDefaultColorConfig,
  getHrPortalColorConfig,
} from "../../../../../../utils/getHrPortalColorConfig";
import { deserializeJson } from "../../../../../../utils/helpers/deserializeJson";
import { formatUserType } from "../../../../../../utils/helpers/formatUserType";
import CustomCheckbox from "../../../../../CustomCheckbox";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import CommonSearchBar from "../../../../CommonSearchBar";
import "../../../../Reports/utils/react-calendar.css";
import { IUserData } from "../../../hooks/useGetUsers";
import {
  selectAllAtom,
  selectedRowIdsAtom,
  unSelectedRowIdsAtom,
} from "../../../utils/atom";
import BulkEditUserModal, {
  EVENT_OPEN_BULK_EDIT_USER_MODAL,
} from "./BulkEditUserModal";

interface SearchFilterProps {
  setSearchQuery: (value: string) => void;
  setStartDate: (value: Date | null) => void;
  setEndDate: (value: Date | null) => void;
  setAiAccess: (value: Set<string>) => void;
  startDate: Date | null;
  endDate: Date | null;
  setStatus: (value: Set<boolean>) => void;
  userData: IUserData | null;
  setRoles: (value: Set<string>) => void;
  setCategories: (value: Set<string>) => void;
  searchQuery: string;
  statusFilter: Set<boolean>;
  rolesFilter: Set<string>;
  categoriesFilter: Set<string>;
  aiAccess: Set<string>;
}

export default function SearchFilter({
  setSearchQuery,
  setStartDate,
  setEndDate,
  setAiAccess,
  setStatus,
  startDate,
  endDate,
  userData,
  setRoles,
  setCategories,
  searchQuery,
  statusFilter,
  rolesFilter,
  categoriesFilter,
  aiAccess,
}: SearchFilterProps) {
  const {
    isOpen: isPopoverOpen,
    onOpen: onPopoverOpen,
    onClose: onPopoverClose,
  } = useDisclosure();
  const colorConfig = IS_HR_PORTAL
    ? getHrPortalColorConfig()
    : getDefaultColorConfig();
  const selectedRowIds = useAtomValue(selectedRowIdsAtom);
  const unselectedRowIds = useAtomValue(unSelectedRowIdsAtom);
  const selectAll = useAtomValue(selectAllAtom);
  const selectedCount = selectAll
    ? userData?.user_count! - unselectedRowIds?.size
    : selectedRowIds?.size;

  // Initialize temp states with current filter values
  const [tempStatusFilter, setTempStatusFilter] = useState<Set<string>>(
    new Set(Array.from(statusFilter).map((val) => val.toString()))
  );
  const [tempAiAccess, setTempAiAccess] = useState<Set<string>>(
    new Set(aiAccess)
  );
  const [tempRoles, setTempRoles] = useState<Set<string>>(new Set(rolesFilter));
  const [tempCategories, setTempCategories] = useState<Set<string>>(
    new Set(categoriesFilter)
  );
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const featureList = deserializeJson(
    localStorage.getItem(LOCAL_STORAGE_FEATURE_LIST_KEY),
    {}
  );
  const { editableLoanCategories } = userStore();

  // Update temp states when props change
  useEffect(() => {
    setTempStatusFilter(
      new Set(Array.from(statusFilter).map((val) => val.toString()))
    );
    setTempAiAccess(new Set(aiAccess));
    setTempRoles(new Set(rolesFilter));
    setTempCategories(new Set(categoriesFilter));
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  }, [
    statusFilter,
    aiAccess,
    rolesFilter,
    categoriesFilter,
    startDate,
    endDate,
  ]);

  const areFiltersApplied =
    tempStatusFilter.size > 0 ||
    tempAiAccess.size > 0 ||
    tempRoles.size > 0 ||
    tempCategories.size > 0 ||
    tempStartDate !== null ||
    tempEndDate !== null;

  const toggleItemInArray = (
    set: Set<string>,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string
  ) => {
    const newSet = new Set(set);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setter(newSet);
  };

  const handleReset = () => {
    // Reset temp states
    setTempAiAccess(new Set());
    setTempStatusFilter(new Set());
    setTempRoles(new Set());
    setTempCategories(new Set());
    setTempStartDate(null);
    setTempEndDate(null);

    // Apply reset immediately
    setStatus(new Set());
    setAiAccess(new Set());
    setRoles(new Set());
    setCategories(new Set());
    setStartDate(null);
    setEndDate(null);
  };

  const handleStartDateChange = (value: Value) => {
    if (Array.isArray(value)) {
      setTempStartDate(value[0] as Date);
    } else if (value instanceof Date) {
      setTempStartDate(value);
    } else {
      setTempStartDate(null);
    }
  };

  const handleEndDateChange = (value: Value) => {
    if (Array.isArray(value)) {
      const endDate = value[1] as Date;
      if (endDate instanceof Date) {
        endDate.setHours(23, 59, 59, 999);
        setTempEndDate(endDate);
      }
    } else if (value instanceof Date) {
      value.setHours(23, 59, 59, 999);
      setTempEndDate(value);
    } else {
      setTempEndDate(null);
    }
  };

  const applyAllFilters = () => {
    // Apply status filter (convert string to boolean)
    setStatus(
      new Set(Array.from(tempStatusFilter).map((val) => val === "true"))
    );

    // Apply other filters
    setAiAccess(new Set(tempAiAccess));
    setRoles(new Set(tempRoles));
    setCategories(new Set(tempCategories));

    // Apply date filters (always set, even if null to clear previous values)
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);

    onPopoverClose();
  };

  const handlePopoverClose = () => {
    // Apply filters when popover closes
    applyAllFilters();
  };

  const handlePopoverOpen = () => {
    // Sync temp states with current filter states when opening
    setTempStatusFilter(
      new Set(Array.from(statusFilter).map((val) => val.toString()))
    );
    setTempAiAccess(new Set(aiAccess));
    setTempRoles(new Set(rolesFilter));
    setTempCategories(new Set(categoriesFilter));
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    onPopoverOpen();
  };

  const [visibleItems, setVisibleItems] = useState<Record<string, number>>({
    Status: 10,
    "AI Access": 10,
    Categories: 10,
    Roles: 10,
    "Date Added": 10,
  });

  const loadMoreItems = (triggerName: string) => {
    setVisibleItems((prev) => ({
      ...prev,
      [triggerName]: prev[triggerName] + 10,
    }));
  };

  const popoverConfig = [
    {
      trigger: "Status",
      count: tempStatusFilter?.size,
      content: [
        { label: "Active", value: "true" },
        {
          label: "Inactive",
          value: "false",
        },
      ],
      onClick: (value: string) =>
        toggleItemInArray(tempStatusFilter, setTempStatusFilter, value),
      value: tempStatusFilter,
    },
    ...(IS_HR_PORTAL
      ? []
      : [
          {
            trigger: "AI Access",
            count: tempAiAccess?.size,
            content: [
              {
                label: "PolyGpt",
                value: featureList?.feature_list?.find(
                  (feature: Feature) =>
                    feature?.name === FeatureIdentifiers.POLYGPT
                )?.id!,
              },
              {
                label: "Policy Comparison",
                value: featureList?.feature_list?.find(
                  (feature: Feature) =>
                    feature?.name === FeatureIdentifiers.POLICY_COMPARISON
                )?.id!,
              },
              {
                label: "AI Assessments",
                value: featureList?.feature_list?.find(
                  (feature: Feature) =>
                    feature?.name === FeatureIdentifiers.AI_ASSESSMENT
                )?.id!,
              },
            ],
            onClick: (value: string) =>
              toggleItemInArray(tempAiAccess, setTempAiAccess, value),
            value: tempAiAccess,
          },
        ]),
    {
      trigger: "Categories",
      count: tempCategories?.size,
      content: editableLoanCategories?.map((item) => ({
        label: item.category_type,
        value: item.id,
      })),
      onClick: (value: string) =>
        toggleItemInArray(tempCategories, setTempCategories, value),
      value: tempCategories,
    },
    {
      trigger: "Roles",
      count: tempRoles?.size,
      content: Object.values(UserType).map((type) => ({
        label: formatUserType(type),
        value: type,
      })),
      onClick: (value: string) =>
        toggleItemInArray(tempRoles, setTempRoles, value),
      value: tempRoles,
    },
    {
      trigger: "Date Added",
      count: tempStartDate || tempEndDate ? 1 : 0,
      content: [],
      onClick: () => setShowDatePicker(true),
      value: new Set<string>(),
    },
  ];

  return (
    <div className="flex flex-row justify-between h-[40px]">
      <div className="flex flex-row gap-4">
        <CommonSearchBar
          flexGrow={1}
          maxH={"40px"}
          h={"40px"}
          minW={"100%"}
          maxW={"449px"}
          handleChange={setSearchQuery}
          placeholder={"Search for Employee ID, Name or Email"}
        />
        <Popover
          placement="right-start"
          autoFocus={false}
          closeOnBlur
          isOpen={isPopoverOpen}
          onClose={handlePopoverClose}
        >
          <PopoverTrigger>
            <Flex
              className={` h-[40px] px-5 items-center justify-center border cursor-pointer rounded-[8px] hover:bg-[#F8F9FA] ${
                areFiltersApplied || isPopoverOpen ? "border-[#555557]" : ""
              } gap-2 text-sm font-semibold border-[#00000014] bg-[#00000005]`}
              onClick={handlePopoverOpen}
            >
              <Filter fontSize={"20px"} className="shrink-0" />
              <CustomText stylearr={[14, 18, 600]} color={"#555557"}>
                Filter
              </CustomText>
            </Flex>
          </PopoverTrigger>
          <Portal>
            <PopoverContent className="w-fit border-none shadow-none">
              <VStack
                className="w-[224px] bg-white shadow-md border border-gray-200 rounded-[12px] p-2 max-h-[300px] overflow-y-auto"
                gap={0}
              >
                <CustomText
                  className="self-end w-full text-right pr-2 pt-1 cursor-pointer"
                  stylearr={[12, 20, 500]}
                  color={colorConfig.textPrimary}
                  as={"u"}
                  onClick={handleReset}
                >
                  Remove Filters
                </CustomText>
                {popoverConfig?.map((item, index) => {
                  return (
                    <>
                      <Popover
                        key={item.trigger}
                        placement="right-start"
                        isOpen={
                          item.trigger === "Date Added"
                            ? showDatePicker
                            : undefined
                        }
                        onClose={() =>
                          item.trigger === "Date Added" &&
                          setShowDatePicker(false)
                        }
                        autoFocus={false}
                        closeOnBlur={true}
                      >
                        <PopoverTrigger>
                          <button
                            className="rounded flex h-10 px-2 justify-between transition-all items-center w-full cursor-pointer"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                colorConfig.menuItemHover;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                            onClick={() => {
                              if (item.trigger === "Date Added") {
                                setShowDatePicker(true);
                              }
                            }}
                          >
                            <div className="flex items-center text-[12px] font-[500] leading-[16px] w-full">
                              <p className="capitalize">{item?.trigger}</p>
                            </div>
                            <div className="flex items-center">
                              {item?.count > 0 && (
                                <div className="bg-[#F3F2F5] rounded-full h-6 w-6 p-1 flex items-center justify-center mr-1">
                                  <span className="text-xs font-medium">
                                    {item.count}
                                  </span>
                                </div>
                              )}
                              <div className="min-w-[20px] w-[20px] h-[20px] flex justify-center items-center rounded-full group-hover:bg-[linear-gradient(231deg,_rgba(55,_98,_221,_0)_13.46%,_rgba(55,_98,_221,_0.2)_194.11%)] transition-all">
                                <ChevronRightIcon />
                              </div>
                            </div>
                          </button>
                        </PopoverTrigger>
                        {item.trigger !== "Date Added" ? (
                          <PopoverContent className="w-fit shadow-none border-none p-0 bg-[transparent]">
                            <VStack
                              className="w-[213px] max-h-[300px] overflow-y-auto border-[1px] bg-white shadow-md border-gray-200 rounded-[12px] p-2"
                              divider={<StackDivider />}
                              gap={0}
                            >
                              {item?.content?.length ? (
                                <>
                                  {item.content
                                    .slice(0, visibleItems[item.trigger])
                                    .map((contentItem: any) => (
                                      <button
                                        key={String(contentItem.value)}
                                        className="p-2 rounded flex justify-between transition-all items-center w-full gap-2 cursor-pointer"
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.background =
                                            colorConfig.menuItemHover;
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.background =
                                            "transparent";
                                        }}
                                        onClick={() =>
                                          item.onClick(
                                            String(contentItem.value)
                                          )
                                        }
                                      >
                                        <div className="flex items-center gap-3 text-[12px] font-[500] leading-[16px]">
                                          <CustomCheckbox
                                            color={colorConfig.checkbox}
                                            isChecked={item.value.has(
                                              contentItem.value
                                            )}
                                            borderRadius="4px"
                                          />
                                          <CustomText
                                            noOfLines={1}
                                            stylearr={[12, 18, 500]}
                                          >
                                            {contentItem.label}
                                          </CustomText>
                                        </div>
                                      </button>
                                    ))}
                                  {item.content.length >
                                    visibleItems[item.trigger] && (
                                    <button
                                      className="p-1 rounded flex justify-center transition-all items-center w-full gap-2 cursor-pointer"
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.background =
                                          colorConfig.menuItemHover;
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background =
                                          "transparent";
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        loadMoreItems(item.trigger);
                                      }}
                                    >
                                      <CustomText
                                        stylearr={[12, 18, 500]}
                                        color={colorConfig.textPrimary}
                                      >
                                        Load More
                                      </CustomText>
                                    </button>
                                  )}
                                </>
                              ) : (
                                <CustomText
                                  noOfLines={1}
                                  stylearr={[12, 18, 500]}
                                  h={"100px"}
                                  alignItems={"center"}
                                  textAlign={"center"}
                                >
                                  No Result Found
                                </CustomText>
                              )}
                            </VStack>
                          </PopoverContent>
                        ) : (
                          <PopoverContent className="w-fit shadow-none border-none p-0 bg-[transparent]">
                            <VStack
                              className="w-[550px] h-[410px] overflow-y-auto border-[1px] bg-white shadow-md border-gray-200 rounded-[12px] p-4"
                              gap={4}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Flex className="flex-col gap-4 w-full">
                                <Flex className="flex-row gap-2 items-center">
                                  <CustomText stylearr={[14, 18, 600]}>
                                    Select Range
                                  </CustomText>
                                </Flex>
                                <Flex className="flex-row items-center gap-4 mb-[-8px]">
                                  <Flex className="flex-col gap-2 w-1/2">
                                    <CustomText stylearr={[14, 20, 500]}>
                                      Starting
                                    </CustomText>
                                    <CustomText
                                      stylearr={[12, 22, 500]}
                                      className="p-2 border rounded-[10px]"
                                    >
                                      {tempStartDate
                                        ? tempStartDate.toLocaleDateString()
                                        : "-"}
                                    </CustomText>
                                  </Flex>
                                  <Flex className="flex-col gap-2 w-1/2">
                                    <CustomText stylearr={[14, 20, 500]}>
                                      Ending
                                    </CustomText>
                                    <CustomText
                                      stylearr={[12, 22, 500]}
                                      className="p-2 border rounded-[10px]"
                                    >
                                      {" "}
                                      {tempEndDate
                                        ? tempEndDate.toLocaleDateString()
                                        : "-"}
                                    </CustomText>
                                  </Flex>
                                </Flex>
                                <Flex className="flex-row gap-7">
                                  <Calendar
                                    key="start-date"
                                    onChange={handleStartDateChange}
                                    value={tempStartDate}
                                    className="react-calendar h-[218px] w-[250px]"
                                    view="month"
                                    defaultView="month"
                                    maxDetail="month"
                                    minDetail="month"
                                    formatShortWeekday={(locale, date) =>
                                      date
                                        .toLocaleDateString(locale, {
                                          weekday: "long",
                                        })
                                        .charAt(0)
                                    }
                                    tileDisabled={({ view }) =>
                                      view !== "month"
                                    }
                                    tileClassName={({ date, view }) =>
                                      view === "month" && date.getDate() === 10
                                        ? "highlight"
                                        : ""
                                    }
                                    maxDate={
                                      tempEndDate ||
                                      new Date(new Date().setHours(0, 0, 0, 0))
                                    }
                                  />
                                  <Calendar
                                    key="end-date"
                                    onChange={handleEndDateChange}
                                    value={tempEndDate}
                                    className="react-calendar h-[218px]  w-[250px]"
                                    view="month"
                                    defaultView="month"
                                    maxDetail="month"
                                    minDetail="month"
                                    formatShortWeekday={(locale, date) =>
                                      date
                                        .toLocaleDateString(locale, {
                                          weekday: "long",
                                        })
                                        .charAt(0)
                                    }
                                    tileDisabled={({ view }) =>
                                      view !== "month"
                                    }
                                    tileClassName={({ date, view }) =>
                                      view === "month" && date.getDate() === 10
                                        ? "highlight"
                                        : ""
                                    }
                                    minDate={
                                      tempStartDate ||
                                      new Date(new Date().setHours(0, 0, 0, 0))
                                    }
                                    maxDate={
                                      new Date(new Date().setHours(0, 0, 0, 0))
                                    }
                                  />
                                </Flex>
                              </Flex>
                            </VStack>
                          </PopoverContent>
                        )}
                      </Popover>
                      {index !== popoverConfig.length - 1 && <StackDivider />}
                    </>
                  );
                })}
              </VStack>
            </PopoverContent>
          </Portal>
        </Popover>
      </div>
      <AnimatePresence>
        {selectedCount ? (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-row h-[40px] rounded-[8px] px-4 items-center cursor-pointer hover:opacity-90 hover:shadow-md"
            style={{
              background: colorConfig.primaryTextGradient,
            }}
            onClick={() =>
              EventBus.getInstance().fireEvent(EVENT_OPEN_BULK_EDIT_USER_MODAL)
            }
          >
            <div className="flex flex-row gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  opacity="0.2"
                  d="M17.3172 7.05791L15 9.3751L10.625 5.0001L12.9422 2.68291C13.0594 2.56579 13.2183 2.5 13.384 2.5C13.5497 2.5 13.7086 2.56579 13.8258 2.68291L17.3172 6.17198C17.3755 6.23005 17.4218 6.29908 17.4534 6.3751C17.485 6.45111 17.5013 6.53262 17.5013 6.61494C17.5013 6.69727 17.485 6.77878 17.4534 6.85479C17.4218 6.93081 17.3755 6.99984 17.3172 7.05791Z"
                  fill="white"
                />
                <path
                  d="M17.7586 5.73262L14.268 2.24122C14.1519 2.12511 14.0141 2.03301 13.8624 1.97018C13.7107 1.90734 13.5482 1.875 13.384 1.875C13.2198 1.875 13.0572 1.90734 12.9056 1.97018C12.7539 2.03301 12.6161 2.12511 12.5 2.24122L2.86641 11.8756C2.74983 11.9912 2.65741 12.1289 2.59451 12.2806C2.5316 12.4323 2.49948 12.595 2.50001 12.7592V16.2506C2.50001 16.5821 2.6317 16.9001 2.86612 17.1345C3.10054 17.3689 3.41849 17.5006 3.75001 17.5006H7.24141C7.40563 17.5011 7.5683 17.469 7.71999 17.4061C7.87168 17.3432 8.00935 17.2508 8.12501 17.1342L17.7586 7.50059C17.8747 7.38452 17.9668 7.2467 18.0296 7.09503C18.0925 6.94335 18.1248 6.78078 18.1248 6.61661C18.1248 6.45243 18.0925 6.28986 18.0296 6.13819C17.9668 5.98651 17.8747 5.8487 17.7586 5.73262ZM4.0086 12.5006L10.625 5.88419L11.9289 7.18809L5.31251 13.8037L4.0086 12.5006ZM3.75001 14.0092L5.99141 16.2506H3.75001V14.0092ZM7.50001 15.992L6.1961 14.6881L12.8125 8.07169L14.1164 9.37559L7.50001 15.992ZM15 8.492L11.5086 5.00059L13.3836 3.12559L16.875 6.61622L15 8.492Z"
                  fill="white"
                />
              </svg>
              <CustomText stylearr={[14, 18, 700]} color={"#FFF"}>
                Bulk Edit
              </CustomText>
            </div>
          </motion.button>
        ) : null}
      </AnimatePresence>
      <BulkEditUserModal
        userData={userData}
        selectedUsers={selectedCount}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        rolesFilter={rolesFilter}
        categoriesFilter={categoriesFilter}
        aiAccess={aiAccess}
        startDateFilter={startDate}
        endDateFilter={endDate}
      />
    </div>
  );
}
