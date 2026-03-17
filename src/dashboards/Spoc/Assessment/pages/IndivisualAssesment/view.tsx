import { Box, Flex, Spinner } from "@chakra-ui/react";
import { Provider } from "jotai";
import { useSearchParams } from "react-router-dom";
import PageLayout from "../../../../../components/common/PageLayout";
import { systemColors } from "../../../../../components/DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../components/DesignSystem/CustomButton";
import useGetUserType from "../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../utils/constants/constants";
import QuestionsTab from "./components/QuestionsTab";
import ResultsTab from "./components/ResultsTab";
import SpocAssementHeader from "./components/SpocAssementHeader";
import useGetAssesment, { IAssesmentDetails } from "./hooks/useGetAssesment";

type tabs = "questions" | "results";
export const TABS: { QUESTIONS: tabs; RESULTS: tabs } = {
  QUESTIONS: "questions",
  RESULTS: "results",
};

const ctas: { label: string; id: tabs }[] = [
  {
    label: "Questions",
    id: TABS.QUESTIONS,
  },
  {
    label: "Results",
    id: TABS.RESULTS,
  },
];

export default function IndivisualAssesment() {
  const {
    data,
    isLoading,
  }: { data: IAssesmentDetails | null; isLoading: boolean } = useGetAssesment();
  const [searchParams, setSearchParams] = useSearchParams();
  const userType = useGetUserType();

  // Get current tab from URL or default to "questions"
  const currentTab = (searchParams.get("tab") as tabs) || TABS.QUESTIONS;
  const isQuestionTab = currentTab === TABS.QUESTIONS;
  const handleTabChange = (tab: tabs) => {
    setSearchParams({ tab }); // Update query params
  };

  if (isLoading && !data) {
    return (
      <Flex w={"full"} justifyContent={"center"} alignItems={"center"}>
        <Spinner />
      </Flex>
    );
  }

  if (data)
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
        <Provider>
          <Flex w="full" flexDir={"column"} gap={"20px"}>
            <SpocAssementHeader data={data} />
            <Flex w={"full"} gap={"24px"}>
              {ctas?.map((row, id) => (
                <CustomButton
                  key={id}
                  onClick={() => handleTabChange(row.id)}
                  flex={1}
                  fontSize={"14px"}
                  borderRadius={"10px"}
                  borderColor={
                    row.id === currentTab
                      ? systemColors.black.absolute
                      : systemColors.grey[200]
                  }
                  variant={row.id === currentTab ? "primary" : "tertiary"}
                >
                  {row.label}
                </CustomButton>
              ))}
            </Flex>
            <Box display={isQuestionTab ? "inherit" : "none"}>
              <QuestionsTab data={data?.questions} />
            </Box>
            <Box display={!isQuestionTab ? "inherit" : "none"}>
              <ResultsTab />
            </Box>
          </Flex>
        </Provider>
      </PageLayout>
    );

  return null;
}
