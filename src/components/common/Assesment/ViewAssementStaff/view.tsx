import { Flex, Spinner } from "@chakra-ui/react";
import { User } from "react-huge-icons/outline";
import { useNavigate } from "react-router-dom";
import useGetUserType from "../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../utils/constants/constants";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import FormHeader from "../../FormHeader";
import PageLayout from "../../PageLayout";
import ViewMcq from "../../ViewMcq";
import useGetResult from "./hooks/useGetResult";
import { isAbfl } from "../../../../utils/constants/endpoints";

export default function ViewAssementStaff() {
  const userType = useGetUserType();
  const { data, isLoading } = useGetResult();
  const navigate = useNavigate();

  if (isLoading)
    return (
      <Flex w={"full"} py={4} justifyContent={"center"} alignItems={"center"}>
        <Spinner />
      </Flex>
    );
  if (data) {
    return (
      <PageLayout
        breadCrumbsData={[
          {
            label: "Assessments",
            navigateTo: `${BASE_ROUTES[userType]}/assessment`,
          },
          {
            label: data?.name,
            navigateTo: ``,
          },
        ]}
      >
        <Flex flexDir={"column"} gap={"20px"} w={"full"}>
          <Flex
            w={"full"}
            borderRadius={"16px"}
            bgColor={systemColors.white.absolute}
            p={"24px"}
          >
            <Flex className="flex-col gap-2">
              <FormHeader
                headerText={`Assessment results - ${data.name}`}
                showBackCTA
                actionBackCTA={() => {
                  navigate(`${BASE_ROUTES[userType]}/assessment`);
                }}
              />
              {isAbfl && (
                <CustomText stylearr={[14, 18, 600]} className="text-[#FF5722]">
                  Note : This assessment is not part of the L&D assessment, and
                  CAD allotment is not dependent on it.
                </CustomText>
              )}
            </Flex>
          </Flex>
          <Flex
            w={"full"}
            borderRadius={"16px"}
            bgColor={systemColors.white.absolute}
            p={"24px"}
            flexDir={"column"}
          >
            <Flex
              w={"52px"}
              h={"52px"}
              borderRadius={"999px"}
              justifyContent={"center"}
              alignItems={"center"}
              p={4}
              bgColor={systemColors.grey[100]}
            >
              <User fontSize={"20px"} />
            </Flex>
            <CustomText stylearr={[32, 40, 700]}>
              {data?.marks_received}/{data?.total_marks}
            </CustomText>
            <CustomText stylearr={[14, 22, 600]}>Marks Obtained</CustomText>
          </Flex>

          {data?.questions?.map((row, id) => {
            const isCorrect = row.correct_answer === row.selected_option;
            return (
              <ViewMcq
                key={id}
                question={row.question}
                options={row.options}
                correct={row.correct_answer}
                skipped={!row.selected_option}
                incorrect={isCorrect ? "" : row.selected_option}
              />
            );
          })}
        </Flex>
      </PageLayout>
    );
  }

  return <></>;
}
