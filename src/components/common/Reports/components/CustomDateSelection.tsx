import { useAtom, useSetAtom } from "jotai";
import { dateSelectionAtom, endDateAtom, startDateAtom } from "../atom";
import { Value } from "react-calendar/dist/esm/shared/types.js";
import { Flex } from "@chakra-ui/react";
import Calendar from "react-calendar";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import "../utils/react-calendar.css";

const CustomDateSelection = () => {
  const [startDate, setStartDate] = useAtom(startDateAtom);
  const [endDate, setEndDate] = useAtom(endDateAtom);
  const setTab = useSetAtom(dateSelectionAtom);
  const handleStartDateChange = (value: Value) => {
    if (Array.isArray(value)) {
      setStartDate(value[0]);
    } else if (value instanceof Date) {
      setStartDate(value);
    } else {
      setStartDate(null);
    }
  };

  const handleEndDateChange = (value: Value) => {
    if (Array.isArray(value)) {
      const endDate = value[1];
      if (endDate instanceof Date) {
        endDate.setHours(23, 59, 59, 999);
        setEndDate(endDate);
      }
    } else if (value instanceof Date) {
      value.setHours(23, 59, 59, 999);
      setEndDate(value);
    } else {
      setEndDate(null);
    }
  };

  return (
    <Flex className="flex-col gap-4">
      <Flex className="flex-row gap-2 items-center ml-[-10px]">
        <ChevronLeftIcon
          fontSize={"32px"}
          cursor={"pointer"}
          onClick={() => {
            setTab("duration");
            setStartDate(null);
            setEndDate(null);
          }}
        />
        <CustomText stylearr={[16, 27, 600]}>Select Range</CustomText>
      </Flex>
      <Flex className="flex-row gap-4 items-center">
        <Flex className="flex-col gap-2">
          <CustomText stylearr={[14, 24, 600]}>Starting</CustomText>
          <CustomText
            stylearr={[13, 22, 500]}
            className="px-5 py-4 border w-[300px] rounded-[10px]"
          >
            {startDate ? startDate.toLocaleDateString() : "-"}
          </CustomText>
        </Flex>
        <Flex className="flex-col gap-2">
          <CustomText stylearr={[14, 24, 600]}>Ending</CustomText>
          <CustomText
            stylearr={[13, 22, 500]}
            className="px-5 py-4 border w-[300px] rounded-[10px]"
          >
            {" "}
            {endDate ? endDate.toLocaleDateString() : "-"}
          </CustomText>
        </Flex>
      </Flex>
      <Flex className="flex-row gap-7">
        <Calendar
          key="start-date"
          onChange={handleStartDateChange}
          value={startDate}
          className="react-calendar w-[250px]"
          view="month"
          defaultView="month"
          maxDetail="month"
          minDetail="month"
          tileDisabled={({ view }) => view !== "month"}
          tileClassName={({ date, view }) =>
            view === "month" && date.getDate() === 10 ? "highlight" : ""
          }
          maxDate={endDate || new Date(new Date().setHours(0, 0, 0, 0))}
        />
        <Calendar
          key="end-date"
          onChange={handleEndDateChange}
          value={endDate}
          className="react-calendar w-[250px]"
          view="month"
          defaultView="month"
          maxDetail="month"
          minDetail="month"
          tileDisabled={({ view }) => view !== "month"}
          tileClassName={({ date, view }) =>
            view === "month" && date.getDate() === 10 ? "highlight" : ""
          }
          minDate={startDate || new Date(new Date().setHours(0, 0, 0, 0))}
          maxDate={new Date(new Date().setHours(0, 0, 0, 0))}
        />
      </Flex>
    </Flex>
  );
};

export default CustomDateSelection;
