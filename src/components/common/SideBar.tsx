import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Flex, Image, Skeleton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Images/TartanLogo.png";
import LogoIcon from "../../assets/Images/TartanLogoIcon.png";
import { sidebarExpandedAtom } from "../../store/sidebarAtom";
import { userStore } from "../../store/userStore";
import { IMenuOption } from "../../utils/data/MenuOptions";
import SideBarListItem from "./SideBarListItem";

const MotionFlex = motion(Flex);
const SideBar = ({ menuOptions }: { menuOptions: IMenuOption[] }) => {
  const navigate = useNavigate();
  const { homeRoute } = userStore();
  const [expanded, setExpanded] = useAtom(sidebarExpandedAtom);

  return (
    <MotionFlex
      initial={{ width: "210px" }}
      animate={{ width: !expanded ? "80px" : "210px" }}
      className={
        "border-r-[1px] border-[#DFE1E6] h-full flex-col  bg-white z-[10]"
      }
    >
      <Flex
        h={"56px"}
        w={"full"}
        className="border-b-[1px] border-[#DFE1E6] p-2"
      >
        <Flex className="p-3 justify-between items-center w-full relative">
          <Image
            src={expanded ? Logo : LogoIcon}
            width={"auto"}
            height={"26px"}
            onClick={() => navigate(homeRoute)}
            cursor="pointer"
          />
          <Flex
            onClick={() => setExpanded((prev) => !prev)}
            className="w-6 h-6 bg-white justify-center items-center rounded-[6px] border-[#DFE1E6] border-[1px] cursor-pointer transition-all hover:brightness-105"
            boxShadow={`0px 1px 2px 0px rgba(13, 13, 18, 0.06)`}
            pos={"absolute"}
            right={-5}
            zIndex={10}
          >
            {expanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </Flex>
        </Flex>
      </Flex>
      <Flex className="flex flex-col justify-between h-full">
        {" "}
        <Flex className="p-4 flex-col gap-1 w-full">
          <Flex className="flex-col w-full gap-2">
            {menuOptions?.length === 0 ? (
              <div className="flex items-center justify-center py-2 flex-col gap-2">
                {Array.from({ length: 4 }, (_, id) => (
                  <Skeleton
                    key={`${id}-menu`}
                    height="30px"
                    borderRadius="md"
                  />
                ))}
              </div>
            ) : (
              <>
                {menuOptions?.map((item, idx) => (
                  <SideBarListItem
                    isExpanded={expanded}
                    item={item}
                    key={idx + item.text}
                  />
                ))}
              </>
            )}
          </Flex>
        </Flex>
        <div className="my-4 mx-1 px-2" />
      </Flex>
    </MotionFlex>
  );
};

export default SideBar;
