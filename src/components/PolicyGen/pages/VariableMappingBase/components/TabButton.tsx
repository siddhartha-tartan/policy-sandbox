import { Flex } from "@chakra-ui/react";
import { customColors } from "../../../../DesignSystem/Colors/CustomColors";
import CustomButton from "../../../../DesignSystem/CustomButton";
import { VARIABLE_MAPPING_TABS, variableMappingTab } from "../utils/constant";
import EventBus from "../../../../../EventBus";
import { EVENT_OPEN_IMPORT_DESTINATION_VARIABLE } from "./ImportDestinationVariableModal";

const ctas: { label: string; id: variableMappingTab }[] = [
  {
    label: "Mapped",
    id: VARIABLE_MAPPING_TABS.MAPPED,
  },
  {
    label: "Unmapped",
    id: VARIABLE_MAPPING_TABS.UNMAPPED,
  },
];

const TabButton = ({
  handleTabChange,
  currentTab,
}: {
  handleTabChange: (e: variableMappingTab) => void;
  currentTab: variableMappingTab;
}) => {
  return (
    <Flex
      className="flex-row justify-between"
      borderBottom={`1px solid ${customColors.SOFT_PEACH}`}
    >
      <Flex className="flex-row gap-4">
        {ctas?.map((row) => {
          const isCurrentTab = row.id === currentTab;
          return (
            <CustomButton
              key={row.label}
              onClick={() => handleTabChange(row.id)}
              className="h-[45px] px-6 text-base"
              style={{
                background: isCurrentTab ? "#F5F9FF" : "#FFF",
                color: isCurrentTab ? "#0073FF" : "#C5C5C7",
                borderColor: "#FFF",
                fontWeight: 700,
              }}
              _hover={{
                transition: "all 250ms ease-out",
              }}
            >
              {row.label}
            </CustomButton>
          );
        })}
      </Flex>
      <CustomButton
        className=" h-[40px] cursor-pointer px-4"
        style={{
          background: "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
          fontSize: "14px",
          fontWeight: 600,
        }}
        onClick={() =>
          EventBus.getInstance().fireEvent(
            EVENT_OPEN_IMPORT_DESTINATION_VARIABLE
          )
        }
      >
        Import Destination Variable
      </CustomButton>
    </Flex>
  );
};

export default TabButton;
