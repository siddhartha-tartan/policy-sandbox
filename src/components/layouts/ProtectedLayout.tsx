import { Box, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import useGetCurrentUser from "../../hooks/useGetCurrentUser";
import useGetFeatures from "../../hooks/useGetFeatures";
import useGetLoanCategories from "../../hooks/useGetLoanCategories";
import useGetUserType from "../../hooks/useGetUserType";
import { userStore } from "../../store/userStore";
import { UserType } from "../../utils/constants/constants";
import {
  ADMIN_MENU_OPTIONS,
  IMenuOption,
  SPOC_MENU_OPTIONS,
} from "../../utils/data/MenuOptions";
import Header from "../common/Header";
import SideBar from "../common/SideBar";

const ProtectedLayout: React.FC = () => {
  let MenuOptions: IMenuOption[] = [];
  const location = useLocation();
  const userType = useGetUserType();
  const { setUserType, setOrganisationId } = userStore();

  useEffect(() => {
    if (!userType) {
      setUserType(UserType.SPOC);
      setOrganisationId("org-mock-001");
      localStorage.setItem("accessToken", "mock-token");
      localStorage.setItem("refreshToken", "mock-refresh-token");
    }
  }, [userType]);

  const { data: feature_list } = useGetFeatures();

  switch (userType) {
    case UserType.ADMIN:
      MenuOptions = ADMIN_MENU_OPTIONS;
      break;
    case UserType.SPOC:
      MenuOptions = SPOC_MENU_OPTIONS;
      break;
    default:
      MenuOptions = SPOC_MENU_OPTIONS;
      break;
  }

  const enabledFeatures =
    feature_list?.feature_list
      ?.filter((feature) => feature.is_enable)
      ?.map((feature) => feature.name) || [];

  const filteredMenuOptions = MenuOptions.filter((menuOption) =>
    enabledFeatures.includes(
      menuOption?.featureIdentifier
        ? menuOption.featureIdentifier
        : menuOption.text
    )
  );

  const isAttempt = location.pathname.includes("attempt");
  useGetLoanCategories();
  useGetCurrentUser();

  return (
    <Flex w="100vw" h="100vh" overflow="hidden" flexDir={"column"}>
      <Flex w={"full"} h={"full"} zIndex={1} opacity={1}>
        {!isAttempt && userType && (
          <SideBar menuOptions={filteredMenuOptions} />
        )}
        <Flex flex="1" flexDir="column" overflow="hidden">
          {!isAttempt && userType && <Header />}
          <Box
            overflow="auto"
            flex="1"
            bgColor={"#fafafa"}
            flexGrow={1}
            flexShrink={1}
          >
            <Outlet />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProtectedLayout;
