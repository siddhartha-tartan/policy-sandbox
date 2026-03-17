import { Divider, Flex, FlexProps, Text } from "@chakra-ui/react";
import React from "react";
import CheckedGreenIcon from "../../assets/Icons/CheckedGreenIcon";
import { customColors } from "../DesignSystem/Colors/CustomColors";
import { systemColors } from "../DesignSystem/Colors/SystemColors";

export interface IStepperStateProps {
  styles: FlexProps;
  trailingIcon?: React.ReactNode | null;
}

export interface IStepperProps {
  data: string[];
  activeTabIndex: number;
  setActiveTab: (e: number) => void;
  activeStateProps?: IStepperStateProps;
  completedStateProps?: IStepperStateProps;
  pendingStateProps?: IStepperStateProps;
  disableBackStep?: boolean;
}

const CustomStepper = ({
  data,
  activeTabIndex,
  setActiveTab,
  activeStateProps = {
    styles: { bg: customColors.ONYX, color: systemColors.white.absolute },
  },
  completedStateProps = {
    styles: {
      bg: systemColors.green["A100"],
      border: `1px solid ${systemColors.green[300]}`,
    },
    trailingIcon: <CheckedGreenIcon />,
  },
  pendingStateProps = { styles: {} },
  disableBackStep = false,
}: IStepperProps) => {
  const getStepperProps = (index: number): IStepperStateProps => {
    if (index < activeTabIndex) return completedStateProps;
    else if (index === activeTabIndex) return activeStateProps;
    else return pendingStateProps;
  };

  const defaultStepperStyles = {
    padding: "12px 24px",
    fontSize: "14px",
    lineHeight: "21px",
    fontWeight: 600,
    border: `1px solid ${customColors.CASPER}`,
    borderRadius: "10px",
  };

  return (
    <Flex
      flexGrow={1}
      w={"full"}
      flexDir={"row"}
      overflowX={"scroll"}
      userSelect={"none"}
    >
      {data?.map((item, idx) => {
        const props = getStepperProps(idx);
        return (
          <React.Fragment key={`${idx}${item}`}>
            <Flex
              flexGrow={1}
              minW={"200px"}
              flexDir={"row"}
              gridGap={"8px"}
              alignItems={"center"}
              justifyContent={"center"}
              cursor={
                !disableBackStep && idx <= activeTabIndex ? "pointer" : "unset"
              }
              onClick={() => {
                if (!disableBackStep && idx <= activeTabIndex) {
                  setActiveTab(idx);
                }
              }}
              {...defaultStepperStyles}
              {...props.styles}
            >
              <Text>{idx + 1}</Text>
              <Text>{item}</Text>
              {props?.trailingIcon}
            </Flex>
            {idx !== data?.length - 1 && (
              <Divider
                orientation="horizontal"
                borderColor={"#B0BEC5"}
                w={"39px"}
                h={"2px"}
                my="auto"
              />
            )}
          </React.Fragment>
        );
      })}
    </Flex>
  );
};

export default CustomStepper;
