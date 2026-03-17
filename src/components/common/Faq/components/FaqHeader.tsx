import { Flex, TextProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PlusThin } from "react-huge-icons/outline";
import EventBus from "../../../../EventBus";
import { userStore } from "../../../../store/userStore";
import { customColors } from "../../../DesignSystem/Colors/CustomColors";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../DesignSystem/CustomButton";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import CommonSearchBar from "../../CommonSearchBar";
import { EVENT_OPEN_BULK_FAQ_MODAL } from "./BulkFaqModal";

const All = { category_type: "All", id: "" };

const FaqHeader = ({
  addPermission,
  isAddNewOpen,
  onClick,
  setCategoryId,
  setSearchQuery,
}: {
  addPermission: boolean;
  isAddNewOpen: boolean;
  onClick: () => void;
  setCategoryId: (e: string) => void;
  setSearchQuery: (e: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState<string>(All.id);
  const { loanCategories } = userStore();
  const params = new URLSearchParams(window.location.search);
  const loan_category_id = params.get("loan_category_id") || "";
  const defaultProps: TextProps = {
    py: "12px",
    px: "12px",
    minW: "110px",
    maxWidth: "160px",
    border: `1px solid ${systemColors.grey[200]}`,
    borderRadius: "10px",
    textAlign: "center",
    cursor: "pointer",
    flexGrow: 1,
  };
  const activeProps = {
    bg: customColors.ONYX,
    color: systemColors.white.absolute,
  };

  useEffect(() => {
    setActiveTab(loan_category_id || All.id);
  }, []);

  return (
    <Flex
      flexDir={"column"}
      gridGap={"44px"}
      p={"24px"}
      bg={systemColors.white.absolute}
      borderRadius={"16px"}
    >
      <Flex flexDir={"row"} justifyContent={"space-between"}>
        <Flex flexDir={"column"} gridGap={"8px"}>
          <CustomText stylearr={[24, 31, 700]}>FAQs</CustomText>

          <CustomText stylearr={[14, 22, 500]} color={customColors.PALE_SKY}>
            All FAQs
          </CustomText>
        </Flex>
        {addPermission && (
          <Flex className="gap-[20px]">
            <CustomButton
              variant="secondary"
              rightIcon={<PlusThin fontSize={"20px"} />}
              w={"223px"}
              h={"56px"}
              borderRadius={"10px"}
              isDisabled={isAddNewOpen}
              onClick={onClick}
            >
              Add FAQ manually
            </CustomButton>
            <CustomButton
              variant="primary"
              rightIcon={<PlusThin fontSize={"20px"} />}
              w={"223px"}
              h={"56px"}
              borderRadius={"10px"}
              isDisabled={isAddNewOpen}
              onClick={() =>
                EventBus.getInstance().fireEvent(EVENT_OPEN_BULK_FAQ_MODAL)
              }
            >
              FAQ Bulk Upload
            </CustomButton>
          </Flex>
        )}
      </Flex>
      <CommonSearchBar
        placeholder={"Search Faq"}
        handleChange={(e: string) => {
          setSearchQuery(e);
        }}
      />
      <Flex
        flexDir={"row"}
        gridGap={"24px"}
        flexWrap={"wrap"}
        alignItems={"center"}
      >
        <CustomText
          stylearr={[14, 21, 600]}
          {...defaultProps}
          onClick={() => {
            setActiveTab(All.id);
            setCategoryId(All.id);
          }}
          {...(activeTab === "" ? activeProps : {})}
        >
          All
        </CustomText>
        {loanCategories?.map((item) => {
          return (
            <CustomText
              key={item.category_type}
              stylearr={[14, 21, 600]}
              {...defaultProps}
              onClick={() => {
                setActiveTab(item.id);
                setCategoryId(item.id);
              }}
              {...(activeTab === item.id ? activeProps : {})}
            >
              {item.category_type}
            </CustomText>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default FaqHeader;
