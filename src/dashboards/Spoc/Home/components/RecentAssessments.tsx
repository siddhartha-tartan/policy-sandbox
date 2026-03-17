import { Flex, Grid, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { customColors } from "../../../../components/DesignSystem/Colors/CustomColors";
import { systemColors } from "../../../../components/DesignSystem/Colors/SystemColors";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";
import { BASE_ROUTES } from "../../../../utils/constants/constants";
import { formatDateString } from "../../../../utils/helpers/formatDate";
import { TABS } from "../../Assessment/pages/IndivisualAssesment/view";
import { IRecentAssessment } from "../hooks/useGetAnalytics";
import EmptyState from "./EmptyState";

const RecentAssessments = ({ data }: { data: IRecentAssessment[] }) => {
  const color = customColors.ONYX;
  const navigate = useNavigate();
  return (
    <VStack spacing={2} w={"full"}>
      {data?.length ? (
        data?.map((item) => (
          <Grid
            className="py-3 w-full px-[6px]"
            templateColumns="1fr 1fr auto"
            justifyContent="space-between"
            key={`assessment-${item.id}`}
            style={{ width: "100%" }}
          >
            <Grid className="flex-col gap-2">
              <CustomText
                stylearr={[12, 16, 500]}
                color={systemColors.black[600]}
              >
                {formatDateString(new Date(item?.end_date))}
              </CustomText>
              <Text
                fontSize="sm"
                fontWeight="600"
                maxW={"90%"}
                color={color}
                isTruncated
                title={item?.assessment_name} // Tooltip for full text on hover
              >
                {item?.assessment_name}
              </Text>
            </Grid>

            <Grid className="flex-col gap-2">
              <CustomText
                stylearr={[12, 16, 500]}
                color={systemColors.black[600]}
              >
                Completed By
              </CustomText>
              <CustomText stylearr={[14, 18, 600]} color={color}>
                {`${item?.participant_attempted || 0} / ${
                  item?.total_participant || 0
                }`}
              </CustomText>
            </Grid>

            <Flex>
              <Grid
                className="px-[14px] py-[10px] w-fit rounded-lg items-center cursor-pointer"
                background={"#E1F5FE"}
                onClick={() =>
                  navigate(
                    `${BASE_ROUTES.SPOC}/assessment/${item?.id}?tab=${TABS.RESULTS}`
                  )
                }
              >
                <CustomText stylearr={[14, 14, 600]} color={"#0288D1"}>
                  Results
                </CustomText>
              </Grid>
            </Flex>
          </Grid>
        ))
      ) : (
        <EmptyState
          title={"No Recent Assessments"}
          subtitle="As users submit assessments, they will appear here for you to review and respond to."
        />
      )}
    </VStack>
  );
};

export default RecentAssessments;
