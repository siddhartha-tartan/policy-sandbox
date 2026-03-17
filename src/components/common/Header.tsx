import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Badge,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { MdLogout, MdSwapHoriz } from "react-icons/md";
import useGetUserType from "../../hooks/useGetUserType";
import useLogoutUser from "../../hooks/useLogoutUser";
import { userStore } from "../../store/userStore";
import { UserType } from "../../utils/constants/constants";
import { formatUserType } from "../../utils/helpers/formatUserType";
import { customColors } from "../DesignSystem/Colors/CustomColors";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";

const Header = () => {
  const userType = useGetUserType();
  const { mutate } = useLogoutUser();
  const { setUserType, setHomeRoute } = userStore();

  const userTypeText = formatUserType(userType);
  const { name, email } = userStore();

  const switchRole = () => {
    const newRole = userType === UserType.SPOC ? UserType.ADMIN : UserType.SPOC;
    setUserType(newRole);
    const baseRoute = newRole === UserType.ADMIN ? "/admin" : "/spoc";
    setHomeRoute(`${baseRoute}/polycraft`);
    window.location.href = `${baseRoute}/polycraft`;
  };

  const otherRole = userType === UserType.SPOC ? "Admin" : "SPOC";

  return (
    <Flex
      padding={"12px 32px"}
      h={"56px"}
      flexDir={"row"}
      gridGap={"24px"}
      justifyContent={"end"}
      borderBottom={`1px solid ${customColors.GREEN_WHITE}`}
      flexShrink={2}
      bgColor={systemColors.white.absolute}
    >
      <Flex className="items-center flex-row gap-4">
        <Badge
          colorScheme={userType === UserType.ADMIN ? "purple" : "blue"}
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="md"
          textTransform="uppercase"
          letterSpacing="0.5px"
        >
          {userType === UserType.ADMIN ? "Admin" : "SPOC"}
        </Badge>
        <Menu>
          <MenuButton transition="all 0.2s">
            <Flex
              cursor={"pointer"}
              flexDir={"row"}
              gridGap={"8px"}
              onClick={(e) => {
                e.stopPropagation();
              }}
              alignItems={"center"}
            >
              <HiOutlineUserCircle size={30} />
              <Flex flexDir={"column"}>
                <CustomText
                  className="capitalize w-full text-left"
                  color={systemColors.black[900]}
                  stylearr={[12, 18, 600]}
                  w={"full"}
                >
                  {userTypeText?.toLowerCase()?.split("_").join(" ")}
                </CustomText>
                <Flex gap={1}>
                  <CustomText
                    className="capitalize"
                    color={systemColors.black[900]}
                    stylearr={[12, 18, 500]}
                  >
                    {name}
                  </CustomText>
                  <CustomText
                    color={systemColors.black[900]}
                    stylearr={[12, 18, 500]}
                  >
                    ({email?.toLowerCase()})
                  </CustomText>
                </Flex>
              </Flex>
              <ChevronDownIcon fontSize={"14px"} />
            </Flex>
          </MenuButton>
          <MenuList minWidth="200px">
            <MenuItem
              fontSize="xs"
              icon={<Icon as={MdSwapHoriz} boxSize={4} />}
              onClick={switchRole}
            >
              Switch to {otherRole}
            </MenuItem>
            <MenuItem
              fontSize="xs"
              icon={<Icon as={MdLogout} boxSize={4} />}
              onClick={() => {
                mutate();
              }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Header;
