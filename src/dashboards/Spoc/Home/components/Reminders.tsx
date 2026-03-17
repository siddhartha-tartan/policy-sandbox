import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { Notification } from "react-huge-icons/outline";
import { customColors } from "../../../../components/DesignSystem/Colors/CustomColors";
import { systemColors } from "../../../../components/DesignSystem/Colors/SystemColors";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";
import { formatDateString } from "../../../../utils/helpers/formatDate";
import { IAssessmentReminder } from "../hooks/useGetAnalytics";
import useRemindAllUsersAssessment from "../hooks/useRemindAllUsersAssessment";
import EmptyState from "./EmptyState";

const Reminders = ({ data }: { data: IAssessmentReminder[] }) => {
  const { mutate, isLoading } = useRemindAllUsersAssessment();

  const color = customColors.ONYX;
  return (
    <Flex
      className="flex-col gap-6 py-6 px-4 border rounded-2xl shrink"
      background={"#FFF"}
      w={"33%"}
      h={"-webkit-fit-content"}
    >
      <Flex className="flex-row gap-2 items-center">
        <Box
          className="flex rounded-lg items-center justify-center w-9 h-9"
          bg={"#E3E9FA"}
        >
          <Icon as={Notification} color={color} fontSize={"24px"} />
        </Box>
        <CustomText stylearr={[16, 20, 700]} color={color}>
          Reminders
        </CustomText>
      </Flex>
      {data?.length ? (
        data?.map((item) => (
          <Flex
            className="py-3 w-full px-[14px] w-full border rounded-lg flex-row justify-between"
            key={`reminder-${item.id}`}
          >
            <Flex className="flex-col gap-2">
              <Text
                fontSize="sm"
                fontWeight="700"
                maxW={"90%"}
                color={color}
                isTruncated
                title={item.assessment_name} // Tooltip for full text on hover
              >
                {item.assessment_name}
              </Text>

              <CustomText
                stylearr={[12, 15, 600]}
                color={systemColors.black[600]}
              >
                {`Expires on: ${formatDateString(new Date(item?.end_date))}`}
              </CustomText>
            </Flex>
            <Flex>
              <Flex
                className="px-[14px] py-[10px] w-fit rounded-lg items-center cursor-pointer"
                background={systemColors.green[50]}
                onClick={
                  isLoading
                    ? () => {}
                    : () => mutate({ assessmentId: item?.id })
                }
              >
                <CustomText
                  stylearr={[14, 14, 600]}
                  color={systemColors.green[500]}
                >
                  Remind All
                </CustomText>
              </Flex>
            </Flex>
          </Flex>
        ))
      ) : (
        <EmptyState
          title={"No Reminders"}
          subtitle={
            "As user creates assessment, they will appear here for you to review and respond to."
          }
        />
      )}
    </Flex>
  );
};

export default Reminders;
