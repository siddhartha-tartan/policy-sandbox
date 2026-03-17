import { HStack, StackDivider } from "@chakra-ui/react";
import { systemColors } from "../../../../components/DesignSystem/Colors/SystemColors";
import StatsCard from "./StatsCard";
import { ComponentType, ReactNode } from "react";

const Stats = ({
  config,
}: {
  config: {
    icon: ComponentType;
    title: string;
    value: any;
    filterComp: ReactNode;
  }[];
}) => {
  return (
    <HStack
      className="w-full flex-row gap-1 justify-between p-6 border rounded-2xl grow"
      bgColor={systemColors.white.absolute}
      divider={<StackDivider borderColor={"rgba(0, 0, 0, 0.08)"} />}
    >
      {config?.map((item, index) => (
        <StatsCard key={`stats-${index}`} data={item} index={index} />
      ))}
    </HStack>
  );
};

export default Stats;
