import { ChevronDownIcon } from "@chakra-ui/icons";
import { Divider } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBulkUsersIcon from "../../../../../../assets/Icons/AddBulkUsersIcon";
import AddUsersIcon from "../../../../../../assets/Icons/AddUsersIcon";
import ModifyBulkUsersIcon from "../../../../../../assets/Icons/ModifyBulkUsersIcon";
import SettingsIcon from "../../../../../../assets/Icons/SettingsIcon";
import { systemColors } from "../../../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import { USER_SUB_ROUTES } from "../../../utils/constant";
import { getHrPortalColorConfig } from "../../../../../../utils/getHrPortalColorConfig";
import { IS_HR_PORTAL } from "../../../../../../utils/constants/endpoints";

export default function Header() {
  const hrPortalConfig = getHrPortalColorConfig();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const popoverConfig = [
    {
      icon: (
        <AddUsersIcon
          color={IS_HR_PORTAL ? hrPortalConfig.primary : "#1D3577"}
        />
      ),
      text: "Add New Users",
      navigateTo: USER_SUB_ROUTES.ADD_USER_MANUAL,
    },
    ...(!IS_HR_PORTAL
      ? [
          {
            icon: <AddBulkUsersIcon />,
            text: "Add Users in Bulk",
            navigateTo: USER_SUB_ROUTES.ADD_USER_CSV,
          },
          {
            icon: <ModifyBulkUsersIcon />,
            text: "Modify Bulk Users",
            navigateTo: USER_SUB_ROUTES.MODIFY_USER_CSV,
          },
        ]
      : []),
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        buttonRef.current &&
        menuRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col gap-2">
        <CustomText stylearr={[24, 32, 600]} color={"#141414"}>
          User Management
        </CustomText>
        <CustomText stylearr={[14, 22, 400]} color={"#555557"}>
          Add, edit, and manage users to control who can access and work with
          your policies.
        </CustomText>
      </div>
      <div className="relative">
        <div
          ref={buttonRef}
          className="flex flex-row h-[40px] rounded-[8px] items-center cursor-pointer transition-all duration-200 hover:opacity-90 hover:shadow-md"
          style={{
            background: IS_HR_PORTAL
              ? hrPortalConfig.primary
              : "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
          }}
          onClick={toggleMenu}
        >
          <div className="flex flex-row gap-2 px-4">
            <SettingsIcon />
            <CustomText stylearr={[14, 18, 600]} color={"#FFF"}>
              Manage Users
            </CustomText>
          </div>
          <div className="w-[1px] h-[24px] bg-white/30"></div>
          <div className="flex items-center px-2">
            <ChevronDownIcon color={systemColors.white.absolute} />
          </div>
        </div>
        {isOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-2 pb-1 bg-white rounded-md shadow-lg z-20 border rounded-[8px]"
            style={{
              width: buttonRef.current ? buttonRef.current.offsetWidth : "auto",
            }}
          >
            {popoverConfig.map((item, index) => (
              <div key={index} className="flex flex-col cursor-pointer">
                <div
                  className="flex items-center gap-2 p-4 rounded-md transition-all duration-200"
                  style={{
                    color: IS_HR_PORTAL ? hrPortalConfig.primary : "#1D3577",
                    background:
                      hoveredIndex === index
                        ? IS_HR_PORTAL
                          ? hrPortalConfig.secondary
                          : "linear-gradient(231deg, rgba(55, 98, 221, 0.00) 13.46%, rgba(55, 98, 221, 0.20) 194.11%)"
                        : "transparent",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => {
                    navigate(item.navigateTo);
                    setIsOpen(false);
                  }}
                >
                  {item.icon}
                  <CustomText stylearr={[14, 22, 500]} color={"#141414"}>
                    {item.text}
                  </CustomText>
                </div>
                {index !== popoverConfig?.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
