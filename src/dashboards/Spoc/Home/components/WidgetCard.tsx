import { Box, Flex, FlexProps, Icon } from "@chakra-ui/react";
import { HTMLMotionProps, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import React, {
  ComponentType,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
} from "react";
import { AddCircle, ClearCircle } from "react-huge-icons/outline";
import { useNavigate } from "react-router-dom";
import { customColors } from "../../../../components/DesignSystem/Colors/CustomColors";
import { systemColors } from "../../../../components/DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../components/DesignSystem/CustomButton";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";
import { dashboardSettingsAtom } from "../../../../store/dashboardSettingsAtom";
import { IWidgetProp } from "./DashboardWidgets";

type MotionFlexProps = FlexProps & HTMLMotionProps<"div">;

interface WidgetCardProps {
  data: IWidgetProp;
}

// Styled MotionFlex
const MotionFlex = motion<MotionFlexProps>(Flex);

// Variants for animation
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (custom: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, delay: custom, ease: "easeInOut" },
  }),
};

// Motion Wrapper
const MotionWrapper = React.memo(
  ({
    children,
    className = "",
    ...props
  }: { className?: string; children: ReactNode } & MotionFlexProps) => (
    <MotionFlex
      className={`w-full grow p-6 border rounded-2xl flex-col gap-4 ${className}`}
      borderColor="#E5E6E6"
      bg="#FFF"
      animate="visible"
      variants={cardVariants}
      custom={0.05}
      initial="hidden"
      exit="hidden"
      {...props}
    >
      {children}
    </MotionFlex>
  )
);

const HeaderSection = ({
  icon,
  title,
  color,
}: {
  icon: ComponentType;
  title: string;
  color: string;
}) => (
  <Flex className="flex-row gap-2 items-center">
    <Box
      className="flex rounded-lg items-center justify-center w-9 h-9"
      bg="#E3E9FA"
    >
      <Icon as={icon} color={color} fontSize="24px" />
    </Box>
    <CustomText stylearr={[16, 20, 700]} color={color}>
      {title}
    </CustomText>
  </Flex>
);

// Action Button
const ActionButton = ({
  label,
  onClick,
  icon,
  color,
  bg,
  borderColor,
}: {
  label: string;
  onClick: () => void;
  icon?: ReactElement<any, string | JSXElementConstructor<any>>;
  color?: string;
  bg?: string;
  borderColor?: string;
}) => (
  <CustomButton
    rightIcon={icon || undefined}
    onClick={onClick}
    style={{ background: bg, color, borderColor }}
    _hover={{}}
  >
    {label}
  </CustomButton>
);

// Widget Card
const WidgetCard = ({ data }: WidgetCardProps) => {
  const navigate = useNavigate();
  const isDashboardSettingView = useAtomValue(dashboardSettingsAtom);
  const color = customColors.ONYX;

  const settingsBg =
    "linear-gradient(180deg, rgba(255, 255, 255, 0.60) 0%, rgba(81, 81, 81, 0.60) 100%)";

  const renderActionButton = () => {
    if (isDashboardSettingView) {
      if (data.state) {
        return (
          <ActionButton
            label="Remove"
            onClick={data.onChange}
            icon={<ClearCircle fontSize="20px" />}
            bg={systemColors.primary}
          />
        );
      }
      return (
        <ActionButton
          label="Removed"
          onClick={data.onChange}
          icon={<ClearCircle fontSize="20px" />}
          bg={systemColors.red[50]}
          color={systemColors.red[500]}
          borderColor={systemColors.red[50]}
        />
      );
    }
    return data?.navigateTo ? (
      <ActionButton
        label="View All"
        onClick={data.navigateTo ? () => navigate(data.navigateTo) : () => {}}
        icon={undefined}
        color={color}
      />
    ) : null;
  };

  return data.isEnabled ? (
    <MotionWrapper
      {...(isDashboardSettingView
        ? {
            className: "items-center justify-center flex-col gap-6 h-[300px]",
            bg: settingsBg,
          }
        : {})}
    >
      {isDashboardSettingView ? (
        <>
          <HeaderSection icon={data.icon} title={data.title} color={color} />
          {renderActionButton()}
        </>
      ) : (
        <>
          <Flex className="flex-row justify-between items-center">
            <HeaderSection icon={data.icon} title={data.title} color={color} />
            {renderActionButton()}
          </Flex>
          {data.bodyComp}
        </>
      )}
    </MotionWrapper>
  ) : isDashboardSettingView ? (
    <MotionWrapper
      className="items-center justify-center flex-col gap-6"
      bg={settingsBg}
    >
      <HeaderSection icon={data.icon} title={data.title} color={color} />
      {data.state ? (
        <ActionButton
          label="Added"
          onClick={data.onChange}
          icon={<AddCircle fontSize="20px" />}
          bg={systemColors.green[50]}
          color={systemColors.green[400]}
        />
      ) : (
        <ActionButton
          label="Add"
          onClick={data.onChange}
          icon={<AddCircle fontSize="20px" />}
          bg={systemColors.primary}
        />
      )}
    </MotionWrapper>
  ) : null;
};

export default WidgetCard;
