import { Flex } from "@chakra-ui/react";
import { PlusThin } from "react-huge-icons/outline";
import { useParams } from "react-router-dom";
import EventBus from "../../../../EventBus";
import useGetUserType from "../../../../hooks/useGetUserType";
import { userStore } from "../../../../store/userStore";
import { BASE_ROUTES, UserType } from "../../../../utils/constants/constants";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../DesignSystem/CustomButton";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import PageLayout from "../../PageLayout";
import { EVENT_OPEN_CREATE_FAQ_MODAL } from "../components/CreateFaqModal";
import ThreadView from "../components/ThreadView";

export default function QueryThread() {
  const userType = useGetUserType();
  const { id } = useParams<{ id: string }>();
  const { loanCategories } = userStore();
  const name =
    loanCategories?.find((item) => item.id === id)?.category_type || "";
  return (
    <PageLayout
      breadCrumbsData={[
        { label: "Discussions", navigateTo: `${BASE_ROUTES[userType]}/query` },
        { label: name, navigateTo: "/" },
      ]}
    >
      <Flex gap={"20px"} overflowY={"auto"} h={"full"} flexDir={"column"}>
        <Flex
          bgColor={systemColors.white.absolute}
          borderRadius={"16px"}
          p={"24px"}
          w={"full"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <CustomText stylearr={[24, 31, 700]} color={systemColors.black[900]}>
            {name}
          </CustomText>
          {userType === UserType.SPOC && (
            <CustomButton
              px={"24px"}
              rightIcon={<PlusThin fontSize={"24px"} />}
              onClick={() => {
                EventBus.getInstance().fireEvent(EVENT_OPEN_CREATE_FAQ_MODAL, {
                  question: "",
                  answer: "",
                });
              }}
            >
              Add new FAQ
            </CustomButton>
          )}
        </Flex>
        <ThreadView />
      </Flex>
    </PageLayout>
  );
}
