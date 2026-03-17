import { SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ComponentType, ReactNode } from "react";
import { DashboardFeaturesEnum } from "../../../../utils/constants/constants";
import WidgetCard from "./WidgetCard";

export interface IWidgetProp {
  icon: ComponentType;
  title: string;
  key: DashboardFeaturesEnum;
  navigateTo: string;
  bodyComp: ReactNode;
  isEnabled: boolean;
  state: boolean;
  onChange: () => void;
}

const MotionSimpleGrid = motion(SimpleGrid);
// Variants for staggering animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const DashboardWidgets = ({ config }: { config: IWidgetProp[] }) => {
  return (
    <MotionSimpleGrid
      className="w-full grow"
      columns={2}
      gap={3}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {config?.map((item) => (
        <WidgetCard data={item} key={item.key} />
      ))}
    </MotionSimpleGrid>
  );
};

export default DashboardWidgets;
