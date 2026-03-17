import { Flex, Spinner } from "@chakra-ui/react";
import { BsChatText } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../../../store/userStore";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../DesignSystem/CustomButton";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import PageLayout from "../../PageLayout";

export default function AllQuery() {
  const { loanCategories: data } = userStore();
  const navigate = useNavigate();

  return (
    <PageLayout breadCrumbsData={[{ label: "Discussions", navigateTo: `/` }]}>
      {!data ? (
        <Flex
          className="w-full justify-center flex-col items-center pb-7 rounded-lg"
          bgColor={systemColors.white.absolute}
        >
          <Flex
            p={"24px"}
            flexDir={"column"}
            borderRadius={"16px"}
            w={"full"}
            gap={2}
          >
            <CustomText stylearr={[24, 31, 700]}>Discussions</CustomText>
          </Flex>{" "}
          <Spinner />
        </Flex>
      ) : (
        <Flex flexDir={"column"} gap={"20px"}>
          <Flex
            p={"24px"}
            flexDir={"column"}
            borderRadius={"16px"}
            w={"full"}
            gap={2}
            bgColor={systemColors.white.absolute}
          >
            <CustomText stylearr={[24, 31, 700]}>Discussions</CustomText>
            <CustomText stylearr={[14, 22, 500]} color={systemColors.grey[600]}>
              Total {data.length} Discussions
            </CustomText>
          </Flex>
          {data?.map((row, id) => (
            <Flex
              key={id}
              p={"24px"}
              flexDir={"column"}
              borderRadius={"16px"}
              w={"full"}
              flexDirection={"column"}
              gap={3}
              bgColor={systemColors.white.absolute}
            >
              <Flex
                w={"full"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <CustomText
                  color={systemColors.grey[900]}
                  stylearr={[18, 27, 600]}
                >
                  {row.category_type?.toLocaleUpperCase()}
                </CustomText>
                <CustomButton
                  onClick={() => navigate(`${row.id}`)}
                  px={6}
                  variant="tertiary"
                  leftIcon={<BsChatText size={20} />}
                  color={systemColors.indigo[500]}
                >
                  View Thread
                </CustomButton>
              </Flex>
              {/* <Divider />
            <Flex gap={"20px"} alignItems={"center"}>
              {[
                { label: "SPOC", value: row.spoc },
                { label: "Query Staff user", value: row.query_staff_users },
              ].map((col, id1) => (
                <Flex
                  p={"8px 12px"}
                  borderRadius={"8px"}
                  bgColor={systemColors.indigo[50]}
                  key={`query-${id1}`}
                  gap={1}
                  color={systemColors.indigo[400]}
                >
                  <CustomText stylearr={[12, 18, 600]}>{col.label}</CustomText>
                  <CustomText
                    stylearr={[12, 18, 800]}
                  >{` - ${col.value}`}</CustomText>
                </Flex>
              ))}
            </Flex> */}
            </Flex>
          ))}
        </Flex>
      )}
    </PageLayout>
  );
}
