import { Button, Flex } from "@chakra-ui/react";
import { ITabConfig } from "./Policy/IndivisualPolicyDetail/components/TabContentWrapper";
import { getHrPortalColorConfig } from "../../utils/getHrPortalColorConfig";
import { IS_HR_PORTAL } from "../../utils/constants/endpoints";

export default function Tabs({
  value,
  setValue,
  buttonConfig,
}: {
  value: string;
  setValue: (e: any) => void;
  buttonConfig: ITabConfig[];
}) {
  const hrPortalcolorConfig = getHrPortalColorConfig();
  const handleButtonClick = (buttonId: string) => {
    setValue(buttonId);
  };

  return (
    <Flex gap={0} w="full">
      {buttonConfig?.map((button) => {
        const isActive = value === button.id;
        return (
          <Button
            key={button.id}
            h="56px"
            leftIcon={button.getIcon(isActive)}
            flexGrow={1}
            fontSize={"14px"}
            borderRadius={"0px"}
            fontWeight={700}
            justifyContent={"flex-start"}
            variant={isActive ? "primary" : "tertiary"}
            style={{
              background: isActive
                ? IS_HR_PORTAL
                  ? hrPortalcolorConfig.secondary
                  : "linear-gradient(95deg, rgba(55, 98, 221, 0.10) -1.14%, rgba(29, 53, 119, 0.10) 158.31%)"
                : "#FFF",
              color: isActive
                ? IS_HR_PORTAL
                  ? hrPortalcolorConfig.primary
                  : "#3762DD"
                : "#111827",
              justifyContent: "center",
              borderBottom: `1px solid ${
                isActive
                  ? IS_HR_PORTAL
                    ? hrPortalcolorConfig.primary
                    : "#3726DD"
                  : "#ECEFF1"
              }`,
            }}
            onClick={() => handleButtonClick(button.id)}
          >
            {button.text}
          </Button>
        );
      })}
    </Flex>
  );
}
