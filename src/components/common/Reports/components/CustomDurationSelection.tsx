import { Flex, Radio } from "@chakra-ui/react";
import { useAtom, useSetAtom } from "jotai";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import { dateSelectionAtom, endDateAtom, startDateAtom } from "../atom";
import { getReportDateRangeOptions } from "../utils/config";
import { useMemo } from "react";

// Utility function to compare dates by year, month, and date (ignoring time)
const compareDates = (date1: Date | null, date2: Date | null) => {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const CustomDurationSelection = () => {
  const [startDate, setStartDate] = useAtom(startDateAtom);
  const [endDate, setEndDate] = useAtom(endDateAtom);
  const custom = "Custom";
  const options = getReportDateRangeOptions();
  const setTab = useSetAtom(dateSelectionAtom);

  const comp = useMemo(() => {
    return (
      <>
        {options?.map((item) => (
          <Flex
            className="flex-row gap-2 cursor-pointer"
            key={item.label}
            onClick={() => {
              setStartDate(item.value?.[0]);
              setEndDate(item.value?.[1]);
            }}
          >
            <Radio
              isChecked={
                compareDates(startDate, item.value?.[0]) &&
                compareDates(endDate, item.value?.[1])
              }
            />
            <CustomText stylearr={[16, 20, 600]} color={systemColors.primary}>
              {item.label}
            </CustomText>
          </Flex>
        ))}
      </>
    );
  }, [startDate, endDate, options]);

  return (
    <Flex className="flex-col gap-4">
      <CustomText stylearr={[18, 24, 600]} color={systemColors.primary}>
        Date
      </CustomText>
      {comp}
      <Flex
        className="flex-row gap-2 cursor-pointer"
        key={"Custom"}
        onClick={() => {
          setStartDate(null);
          setEndDate(null);
          setTab("date");
        }}
      >
        <Radio onChange={() => {}} />
        <CustomText stylearr={[16, 20, 600]} color={systemColors.primary}>
          {custom}
        </CustomText>
      </Flex>
    </Flex>
  );
};

export default CustomDurationSelection;
