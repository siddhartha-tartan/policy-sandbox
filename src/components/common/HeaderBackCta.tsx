import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { sidebarExpandedAtom } from "../../store/sidebarAtom";
import CustomText from "../DesignSystem/Typography/CustomText";

const HeaderBackCta = ({ navigateTo }: { navigateTo: string | number }) => {
  const isSidebarExpanded = useAtomValue(sidebarExpandedAtom);
  const navigate = useNavigate();
  return (
    <Flex
      className={`z-10 h-[66px] items-center justify-center transition-all duration-300`}
      style={{
        transition: "left 0.3s ease-in-out",
        position: "fixed",
        top: "0px",
        left: isSidebarExpanded ? "271px" : "135px",
      }}
    >
      <Flex
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => {
          navigate(navigateTo as string);
        }}
      >
        <ChevronLeftIcon fontSize={"24px"} />
        <CustomText color={"#111827"} stylearr={[16, 21, 600]}>
          Go back
        </CustomText>
      </Flex>
    </Flex>
  );
};

export default HeaderBackCta;
