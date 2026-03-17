import { Flex, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { IMenuOption } from "../../utils/data/MenuOptions";
import CustomText from "../DesignSystem/Typography/CustomText";
import { FeatureIdentifiers } from "../../utils/constants/constants";

const MotionFlex = motion(Flex);

const SideBarListItem = ({
  item,
  isExpanded,
}: {
  item: IMenuOption;
  isExpanded: boolean;
}) => {
  const navigate = useNavigate();
  const isMenuItemActive = useMemo(() => {
    let ans = false;
    item?.activePath?.forEach((i) => {
      const currentLoc = window.location.pathname
        .split("/")
        .splice(0, 3)
        .join("/");
      if (currentLoc === `${i}`) {
        ans = true;
      }
    });
    return ans;
  }, [window.location.pathname, item.text]);
  const isNewBadge = item?.featureIdentifier === FeatureIdentifiers.POLYGPT;

  return (
    <MotionFlex
      role="group"
      className="w-full px-2 py-[6px] gap-1 items-center cursor-pointer rounded-[8px] justify-between hover:border-b-[1px]"
      borderBottomColor={"#3762DD"}
      onClick={() => {
        if (item.featureIdentifier === "PolyGPT") {
          if (!isMenuItemActive) navigate(item.path);
        } else {
          navigate(item.path);
        }
      }}
      style={{
        background: isMenuItemActive
          ? "linear-gradient(95deg, rgba(55, 98, 221, 0.06) -1.14%, rgba(29, 53, 119, 0.06) 158.31%)"
          : "",
      }}
      borderBottom={
        isMenuItemActive ? "1px solid #3762DD" : ""
      }
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        opacity: isExpanded ? 1 : 0.8,
        transition: { duration: 0.2 },
      }}
    >
      <Flex className="gap-2 items-center">
        <Icon
          as={item.icon}
          my="auto"
          w="16px"
          h="16px"
          alignItems="center"
          color={isMenuItemActive ? "#3762DD" : "#141414"}
          _groupHover={{ color: "#3762DD" }}
        />
        {isExpanded && (
          <MotionFlex
            className="gap-2 items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CustomText
              noOfLines={1}
              color={isMenuItemActive ? "#3762DD" : "#141414"}
              stylearr={[12, 16, 600]}
              letterSpacing="0.32px"
              _groupHover={{ color: "#3762DD" }}
            >
              {item.text}
            </CustomText>
            {isNewBadge && (
              <div
                className="items-center justify-center flex px-2 py-1 rounded-[6px]"
                style={{
                  background:
                    "linear-gradient(103deg, #F0F0F0 12.48%, #D5D5D5 116.46%)",
                }}
              >
                <CustomText stylearr={[10, 12, 500]} color={"#555557"}>
                  NEW
                </CustomText>
              </div>
            )}
          </MotionFlex>
        )}
      </Flex>
    </MotionFlex>
  );
};

export default SideBarListItem;
