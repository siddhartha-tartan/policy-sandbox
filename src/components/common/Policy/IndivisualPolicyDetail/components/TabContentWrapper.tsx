import { Flex } from "@chakra-ui/react";
import { VscHistory } from "react-icons/vsc";
import { useLocation, useNavigate } from "react-router-dom";
import PolicyIcon from "../../../../../assets/Icons/PolicyIcon";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import Tabs from "../../../Tabs";
import { ACTIVE_BUTTON } from "../view";
import { IS_HR_PORTAL } from "../../../../../utils/constants/endpoints";
import { getHrPortalColorConfig } from "../../../../../utils/getHrPortalColorConfig";

interface IProp {
  versionHistory: JSX.Element;
  policyDetails: JSX.Element;
}

export interface ITabConfig {
  id: string;
  text: string;
  getIcon: (isActive: boolean) => JSX.Element;
}

export default function TabContentWrapper({
  versionHistory,
  policyDetails,
}: IProp) {
  const hrPortalColorConfig = getHrPortalColorConfig();
  const query = new URLSearchParams(useLocation().search);
  const activeButton = query.get("tab") || ACTIVE_BUTTON.POLICYDETAIL;
  const navigate = useNavigate();

  const setActiveButton = (button: string) => {
    navigate(`?tab=${button}`, { replace: true });
  };
  const isVersionTab = activeButton === ACTIVE_BUTTON.VERSIONHISTORY;

  const buttonConfig: ITabConfig[] = [
    {
      id: "policyDetails",
      text: "Policy Details",
      getIcon: (isActive: boolean) => (
        <PolicyIcon
          color={
            !isActive
              ? systemColors.black.absolute
              : IS_HR_PORTAL
              ? hrPortalColorConfig.primary
              : "#3726DD"
          }
        />
      ),
    },
    {
      id: "versionHistory",
      text: "Version History",
      getIcon: (isActive: boolean) => (
        <VscHistory
          fontSize={"20px"}
          color={
            !isActive
              ? systemColors.black.absolute
              : IS_HR_PORTAL
              ? hrPortalColorConfig.primary
              : "#3726DD"
          }
        />
      ),
    },
  ];

  return (
    <Flex
      className="flex flex-col flex-grow flex-shrink overflow-y-auto"
      gap={"32px"}
    >
      <Tabs
        value={activeButton}
        buttonConfig={buttonConfig}
        setValue={setActiveButton}
      />
      <Flex w={"full"} flexGrow={1} overflowY={"auto"}>
        <Flex
          display={isVersionTab ? "inherit" : "none"}
          overflowY={"auto"}
          flexGrow={1}
        >
          {versionHistory}
        </Flex>
        <Flex
          display={!isVersionTab ? "inherit" : "none"}
          overflowY={"auto"}
          flexGrow={1}
        >
          {policyDetails}
        </Flex>
      </Flex>
    </Flex>
  );
}
