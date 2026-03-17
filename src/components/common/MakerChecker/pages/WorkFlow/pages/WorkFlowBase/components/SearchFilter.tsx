import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import { Range } from "react-date-range";
import { userStore } from "../../../../../../../../store/userStore";
import CustomText from "../../../../../../../DesignSystem/Typography/CustomText";
import CommonDropdownComponent from "../../../../../../CommonDropdownComponent";
import CommonSearchBar from "../../../../../../CommonSearchBar";
import DateRangeFilter from "../../../../../../DateRangeFilter";

const commonProps = {
  fontSize: "14px",
  lineHeight: "14px",
  fontWeight: 600,
  color: "#1B2559",
  height: "40px",
  paddingRight: "24px",
  paddingLeft: "24px",
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const SearchFilter = ({
  setSearch,
  status,
  setStatus,
  category,
  setCategory,
  setFromDate,
  setToDate,
}: {
  setSearch: (e: string) => void;
  status: string;
  setStatus: (e: string) => void;
  category: string;
  setCategory: (e: string) => void;
  setFromDate: (e: string) => void;
  setToDate: (e: string) => void;
}) => {
  const { loanCategories } = userStore();

  const handleDateSelection = (dateRange: Range[] | null) => {
    if (!dateRange || !dateRange[0]) {
      setFromDate("");
      setToDate("");
      return;
    }

    let updatedEndDate = dateRange[0].endDate
      ? new Date(dateRange[0].endDate)
      : undefined;

    if (updatedEndDate) {
      updatedEndDate.setDate(updatedEndDate.getDate() + 1);
    }

    setFromDate(formatDate(dateRange[0].startDate!));
    setToDate(formatDate(updatedEndDate!));
  };

  const loanCategoriesOptions =
    loanCategories?.map((item) => ({
      label: item.category_type,
      value: item.id,
    })) || [];
  const {
    isOpen: isPopoverOpen,
    onOpen: onPopoverOpen,
    onClose: onPopoverClose,
  } = useDisclosure();

  return (
    <div className="flex flex-row justify-between h-[40px]">
      <CommonSearchBar
        placeholder="Search for a specific request..."
        handleChange={setSearch}
        className="w-[450px]"
      />
      <div className="flex flex-row gap-6">
        <CommonDropdownComponent
          title={"Category"}
          options={loanCategoriesOptions}
          value={category}
          onChange={setCategory}
          style={commonProps}
          isResetAble={true}
        />
        <CommonDropdownComponent
          title={"Status"}
          options={[
            { label: "Active", value: "true" },
            { label: "InActive", value: "false" },
          ]}
          value={status}
          onChange={setStatus}
          style={commonProps}
          isResetAble={true}
        />
        <Popover
          placement="auto"
          autoFocus={false}
          isOpen={isPopoverOpen}
          onClose={onPopoverClose}
        >
          <PopoverTrigger>
            <button
              onClick={onPopoverOpen}
              className="hover:bg-[#F8F9FA] flex flex-row gap-1 py-2 px-3 border rounded-[8px]  cursor-pointer items-center"
              {...commonProps}
            >
              <CustomText stylearr={[14, 14, 600]} color={"#1B2559"}>
                {" "}
                Created On
              </CustomText>
              <ChevronDownIcon />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-fit shadow-none border-none p-0 bg-[transparent]">
            <DateRangeFilter
              handleDateSelection={handleDateSelection}
              onSelect={() => {
                onPopoverClose();
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default SearchFilter;
