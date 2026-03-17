import { ChevronRightIcon } from "@chakra-ui/icons";
import { Flex, Spinner, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_ROUTES } from "../../../../../utils/constants/constants";
import { formatDateString } from "../../../../../utils/helpers/formatDate";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import Status from "../../../Status";
import useAttempt from "../../hooks/useAttempt";
import useGetAttemptAssesment from "../../hooks/useGetAttemptAssesment";
import { ASSESMENT_SUB_ROUTES } from "../../utils/constants";
import ImportantMessageModal from "./ImportantMessageModal";
import useGetUserType from "../../../../../hooks/useGetUserType";

const renderItem = (label: string, value: string) => {
  return (
    <>
      <CustomText stylearr={[16, 31, 700]}>{label}</CustomText>
      <CustomText stylearr={[14, 22, 500]} color={systemColors.grey[600]}>
        {value}
      </CustomText>
    </>
  );
};
export default function AttemptAssesments() {
  const { data: attemptAssesments, isLoading } = useGetAttemptAssesment();
  const navigate = useNavigate();
  const { mutate, isLoading: isAttemptLoading } = useAttempt();
  const [id, setId] = useState<string>("");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const userType = useGetUserType();
  if (isLoading || !attemptAssesments)
    return (
      <Flex
        p={"24px"}
        bgColor={systemColors.white.absolute}
        borderRadius={"16px"}
        gap={"20px"}
        flexDir={"column"}
      >
        <Flex gap={2} flexDir={"column"}>
          <CustomText stylearr={[24, 31, 700]}>Assessments</CustomText>
        </Flex>
        <Flex w={"full"} justifyContent={"center"}>
          <Spinner />
        </Flex>
      </Flex>
    );

  if (attemptAssesments.length === 0) return <></>;
  return (
    <>
      <Flex
        flexDir={"column"}
        gap={2}
        p={"24px"}
        bgColor={systemColors.white.absolute}
        borderRadius={"16px"}
      >
        <CustomText stylearr={[24, 31, 700]}>Assessments</CustomText>
        <CustomText stylearr={[14, 22, 500]} color={systemColors.grey[600]}>
          Total {attemptAssesments.length} assessments pending
        </CustomText>
      </Flex>
      {attemptAssesments?.map((row, id) => {
        const currentDate = new Date().getTime();
        const canAttempt =
          currentDate < new Date(row.end_date).getTime() &&
          currentDate > new Date(row.start_date).getTime();
        return (
          <Flex
            p={"24px"}
            borderRadius={"16px"}
            bgColor={systemColors.white.absolute}
            key={id}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Flex w={"20%"} flexDir={"column"}>
              {renderItem("Policy Name", row.name)}
            </Flex>
            <Flex w={"15%"} flexDir={"column"}>
              {renderItem(
                "Start Date",
                formatDateString(new Date(row.start_date))
              )}
            </Flex>
            <Flex w={"15%"} flexDir={"column"}>
              {renderItem("Due Date", formatDateString(new Date(row.end_date)))}
            </Flex>
            <Flex w={"15%"} flexDir={"column"}>
              {renderItem("Passing Score", `${row.passing_score}%`)}
            </Flex>
            {
              //@ts-ignore
              <Status status={row.status} />
            }
            <CustomButton
              variant="tertiary"
              borderColor={systemColors.black[600]}
              borderRadius={"10px"}
              rightIcon={<ChevronRightIcon fontSize={"24px"} />}
              rowGap={1}
              isDisabled={!canAttempt}
              onClick={() => {
                setId(row.id);
                onOpen();
              }}
            >
              Attempt
            </CustomButton>
          </Flex>
        );
      })}
      <ImportantMessageModal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isAttemptLoading}
        onProceed={() => {
          mutate(
            { id: id },
            {
              onSuccess(successData) {
                navigate(
                  `${BASE_ROUTES[userType]}/assessment/${
                    ASSESMENT_SUB_ROUTES.ATTEMPT.split(":")[0]
                  }${id}?attempt_id=${successData?.id}`
                );
              },
            }
          );
        }}
      />
    </>
  );
}
