import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import {
  DateRange,
  DateRangeProps,
  Range,
  RangeKeyDict,
} from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import CustomButton from "../DesignSystem/CustomButton";
const TypedDateRangePicker = DateRange as unknown as React.FC<DateRangeProps>;

interface IProps {
  handleDateSelection: Function;
  onSelect?: Function;
}

const DateRangeFilter = ({
  handleDateSelection,
  onSelect = () => {},
}: IProps) => {
  const defaultDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  };
  const [dateRange, setDateRange] = useState<Range[] | null>(null);
  const handleRangeSelection = (item: RangeKeyDict) => {
    setDateRange([item.selection]);
  };

  return (
    <Flex
      className="h-fit flex-col p-4 rounded-[16px] p-0"
      flexShrink={1}
      background={"white"}
    >
      <TypedDateRangePicker
        onChange={(item: RangeKeyDict) => handleRangeSelection(item)}
        moveRangeOnFirstSelection={false}
        months={1}
        ranges={dateRange || [defaultDateRange]}
        maxDate={new Date()}
        direction="horizontal"
        preventSnapRefocus={true}
        calendarFocus="backwards"
      />
      <Flex className="justify-center flex-row gap-3">
        <CustomButton
          variant="secondary"
          h={"30px"}
          className="w-1/2 py-0"
          onClick={() => {
            setDateRange(null);
            handleDateSelection(null);
            onSelect();
          }}
        >
          Cancel
        </CustomButton>
        <CustomButton
          variant="quaternary"
          className="w-1/2 py-0"
          h={"30px"}
          onClick={() => {
            handleDateSelection(dateRange);
            setDateRange(null);
            onSelect();
          }}
        >
          Apply
        </CustomButton>
      </Flex>
    </Flex>
  );
};

export default DateRangeFilter;
