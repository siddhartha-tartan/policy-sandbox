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
import { Range } from "react-date-range";
import { Filter } from "react-huge-icons/outline";
import CustomCheckbox from "../../../../CustomCheckbox";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import DateRangeFilter from "../../../DateRangeFilter";
import { ISpocUser } from "../../../../../hooks/useGetPolicyManagersByCategory";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Deactivated", value: "deactivated" },
  { label: "Drafted", value: "drafted" },
];

const PolicyFilters = ({
  owner,
  setOwner,
  status,
  setStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  spocUsers,
}: {
  owner: string[];
  setOwner: Function;
  status: string[];
  setStatus: Function;
  startDate: string;
  setStartDate: Function;
  endDate: string;
  setEndDate: Function;
  spocUsers: ISpocUser[];
}) => {
  const {
    isOpen: isPopoverOpen,
    onOpen: onPopoverOpen,
    onClose: onPopoverClose,
  } = useDisclosure();
  const handleDateSelection = (dateRange: Range[] | null) => {
    if (!dateRange) {
      setStartDate("");
      setEndDate("");
    }
    onPopoverClose();
    setStartDate(formatDate(dateRange?.[0]?.startDate!));
    setEndDate(formatDate(dateRange?.[0]?.endDate!));
  };

  const toggleItemInArray = (
    array: string[],
    setArray: Function,
    item: string
  ) => {
    const updatedArray = [...array];
    if (updatedArray.includes(item)) {
      const index = updatedArray.indexOf(item);
      if (index > -1) {
        updatedArray.splice(index, 1);
      }
    } else {
      updatedArray.push(item);
    }
    setArray(updatedArray);
  };

  const popoverConfig = [
    {
      trigger: "Policy Manager",
      content: spocUsers?.map((item) => ({
        label: item?.user_name,
        value: item?.id,
      })),
      value: owner,
      onClick: (e: string) => {
        toggleItemInArray(owner, setOwner, e);
      },
    },
    {
      trigger: "Status",
      content: statusOptions,
      value: status,
      onClick: (e: string) => {
        toggleItemInArray(status, setStatus, e);
      },
    },
    {
      trigger: "Date",
      comp: <DateRangeFilter handleDateSelection={handleDateSelection} />,
    },
  ];

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setOwner([]);
    setStatus([]);
  };

  const areFiltersApplied =
    owner?.length || status?.length || startDate || endDate;

  return (
    <Popover
      placement="right-start"
      autoFocus={false}
      closeOnBlur
      isOpen={isPopoverOpen}
      onClose={onPopoverClose}
    >
      <PopoverTrigger>
        <Flex
          className={`w-[54px] h-[54px] items-center justify-center border cursor-pointer rounded-[8px] hover:bg-[#F8F9FA] ${
            areFiltersApplied && "bg-[#F5F9FF]"
          }`}
          onClick={onPopoverOpen}
        >
          <Filter fontSize={"20px"} />
        </Flex>
      </PopoverTrigger>
      <Portal>
        <PopoverContent className="w-fit border-none shadow-none">
          <VStack className="w-[224px] bg-white shadow-md border border-gray.200 rounded-[12px] p-2 gap-2 max-h-[300px] overflow-y-auto">
            <CustomText
              className="self-end w-full text-right pr-2 pt-1 cursor-pointer"
              stylearr={[13, 20, 600]}
              color={"#2A4AA9"}
              as={"u"}
              onClick={handleReset}
            >
              Reset Filters
            </CustomText>
            {popoverConfig?.map((item, index) => {
              return (
                <>
                  <Popover key={item.trigger} placement="right-start">
                    <PopoverTrigger>
                      <button className="pt-[10px] group pr-[12px] pb-[12px] pl-[10px] hover:bg-[#F8F9FA] flex justify-between transition-all items-center w-full gap-2 cursor-pointer">
                        <div className="flex items-center gap-3 text-[12px] font-[500] leading-[16px] w-full">
                          <p className="capitalize">{item?.trigger}</p>
                        </div>
                        <button className="min-w-[20px] w-[20px] h-[20px] flex justify-center items-center rounded-full group-hover:bg-[#E1E1E3] transition-all">
                          <ChevronRightIcon />
                        </button>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit shadow-none border-none p-0 bg-[transparent]">
                      {item?.comp ? (
                        item.comp
                      ) : (
                        <VStack
                          divider={<StackDivider style={{ margin: 0 }} />}
                          className="w-[213px] max-h-[300px] overflow-y-auto border-[1px] bg-white shadow-md border-gray.200 rounded-[12px] p-2 gap-2"
                        >
                          {item?.content?.length ? (
                            item?.content?.map((contentItem) => (
                              <button
                                key={contentItem?.value}
                                className="pt-[10px] group pr-[12px] pb-[12px] pl-[10px] hover:bg-[#F8F9FA] flex justify-between transition-all items-center w-full gap-2 cursor-pointer"
                                onClick={() =>
                                  item?.onClick(contentItem?.value)
                                }
                              >
                                <div className="flex items-center gap-3 text-[12px] font-[500] leading-[16px]">
                                  <CustomCheckbox
                                    color="#176FC1"
                                    isChecked={item?.value?.includes(
                                      contentItem?.value
                                    )}
                                    borderRadius="4px"
                                  />
                                  <CustomText
                                    noOfLines={1}
                                    stylearr={[12, 18, 500]}
                                  >
                                    {contentItem?.label}
                                  </CustomText>
                                </div>
                              </button>
                            ))
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
                      )}
                    </PopoverContent>
                  </Popover>
                  {index !== 0 && <StackDivider style={{ margin: 0 }} />}
                </>
              );
            })}
          </VStack>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default PolicyFilters;
