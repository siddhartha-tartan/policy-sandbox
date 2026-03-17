import { Box, chakra, Divider, Flex } from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useMemo, useState } from "react";
import { ClockCircle } from "react-huge-icons/outline";
import { BiErrorCircle } from "react-icons/bi";
import useUpdateAssesment from "../../../../../../components/common/Assesment/hooks/useUpdateAssesment";
import CustomInput from "../../../../../../components/common/CustomInput";
import CustomModal from "../../../../../../components/common/CustomModal";
import { systemColors } from "../../../../../../components/DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../../components/DesignSystem/CustomButton";
import CustomText from "../../../../../../components/DesignSystem/Typography/CustomText";
import P4 from "../../../../../../components/DesignSystem/Typography/Paragraph/P4";
import { queryClient } from "../../../../../../ProviderWrapper";
import { isNullOrUndefined } from "../../../../../../utils/helpers/isNullorUndefined";
import {
  ASSESMENT_DETAIL_FORM_KEYS,
  AssesmentFormValidators,
} from "../../../utils/validators";
import { getAssesmentById, IAssesmentDetails } from "../hooks/useGetAssesment";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  data: IAssesmentDetails;
}

const ErrorComponent = ({ error }: { error: string }) => {
  if (!error || error === "") {
    return <React.Fragment />;
  }
  return (
    <Flex flexDir={"row"} gridGap={"4px"} alignItems={"center"} mt={"-8px"}>
      <Box style={{ marginLeft: 8 }}>
        <BiErrorCircle size={14} color={systemColors.red.A700} />
      </Box>
      <P4 color={systemColors.red.A700}>{error}</P4>
    </Flex>
  );
};

export default function EditDateTimeModal({
  isOpen,
  onClose,
  onSave,
  data,
}: IProps) {
  const { mutate, isLoading } = useUpdateAssesment();
  const [endDate, setEndDate] = useState<string>(
    data?.end_date ? format(new Date(data.end_date), "yyyy-MM-dd'T'HH:mm") : ""
  );
  const [passingScore, setPassingScore] = useState<number>(data?.passing_score);
  const [errors, setErrors] = useState<Record<string, string>>({
    [ASSESMENT_DETAIL_FORM_KEYS.END_DATE]: "",
    [ASSESMENT_DETAIL_FORM_KEYS.PASSING_SCORE]: "",
  });

  const onBlur = (e: any) => {
    const val = e.target.value;
    if (!val) {
      setErrors((prev) => ({
        ...prev,
        [ASSESMENT_DETAIL_FORM_KEYS.END_DATE]: "End Date is Required",
      }));
    } else {
      const startDate = format(new Date(data.start_date), "yyyy-MM-dd'T'HH:mm");
      const enddDate = e.target.value;
      if (startDate && enddDate) {
        if (
          ["string", "number"].includes(typeof startDate) &&
          ["string", "number"].includes(typeof enddDate)
        ) {
          if (enddDate <= startDate) {
            setErrors((prev) => ({
              ...prev,
              [ASSESMENT_DETAIL_FORM_KEYS.END_DATE]:
                "End Date must be greater than Start Date",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              [ASSESMENT_DETAIL_FORM_KEYS.END_DATE]: "",
            }));
          }
        }
      }
    }
  };

  const isDisabled: boolean = useMemo(() => {
    return Object.values(errors).some(
      (item) => !isNullOrUndefined(item) && item !== ""
    );
  }, [errors]);

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <Flex
        flexDir="column"
        p="24px"
        borderRadius="12px"
        w="500px"
        gap="32px"
        justifyContent="center"
        alignItems="center"
      >
        <Flex
          gap={"20px"}
          w={"full"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDir={"column"}
        >
          <Flex
            w={"66px"}
            justifyContent={"center"}
            alignItems={"center"}
            borderRadius={"999px"}
            h="66px"
            bgColor={systemColors.indigo[50]}
          >
            <Flex
              w={"46px"}
              borderRadius={"999px"}
              justifyContent={"center"}
              alignItems={"center"}
              h="46px"
              bgColor={systemColors.indigo[100]}
            >
              <ClockCircle color={systemColors.indigo[600]} fontSize={"24px"} />
            </Flex>
          </Flex>
          <CustomText stylearr={[18, 28, 700]}>
            Edit End Date for assessment
          </CustomText>
        </Flex>
        <Flex w={"full"} gap={"10px"} flexDir={"column"}>
          <CustomText stylearr={[14, 22, 500]}>
            Select End Date & Time<chakra.span color={"red"}>*</chakra.span>
          </CustomText>
          <CustomInput
            value={endDate}
            onChange={(e: any) => setEndDate(e.target.value)}
            h="56px"
            type="datetime-local"
            onBlur={onBlur}
          />
          <ErrorComponent error={errors[ASSESMENT_DETAIL_FORM_KEYS.END_DATE]} />
        </Flex>
        <Divider />
        <Flex w={"full"} gap={"10px"} flexDir={"column"}>
          <CustomText stylearr={[14, 22, 500]}>
            Passing score<chakra.span color={"red"}>*</chakra.span>
          </CustomText>
          <CustomInput
            value={passingScore}
            onChange={(e: any) => setPassingScore(e.target.value)}
            h="56px"
            type="number"
            onBlur={(e) => {
              const val = e.target.value;
              if (!val) {
                setErrors((prev) => ({
                  ...prev,
                  [ASSESMENT_DETAIL_FORM_KEYS.PASSING_SCORE]:
                    "Passing Score is required",
                }));
              } else {
                const validatorFn =
                  AssesmentFormValidators[
                    ASSESMENT_DETAIL_FORM_KEYS.PASSING_SCORE
                  ];
                const errorMsg = validatorFn(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  [ASSESMENT_DETAIL_FORM_KEYS.PASSING_SCORE]: errorMsg || "",
                }));
              }
            }}
          />
          <ErrorComponent
            error={errors[ASSESMENT_DETAIL_FORM_KEYS.PASSING_SCORE]}
          />
        </Flex>
        <Flex w="full" gap="24px">
          <CustomButton
            borderRadius="8px"
            borderColor={systemColors.black[200]}
            variant="tertiary"
            flex={1}
            fontWeight={"16px"}
            onClick={onClose}
          >
            Cancel
          </CustomButton>
          <CustomButton
            bgColor={systemColors.grey[900]}
            borderRadius="8px"
            fontWeight={"16px"}
            flex={1}
            isLoading={isLoading}
            isDisabled={isDisabled}
            onClick={() => {
              onSave();
              mutate(
                {
                  id: data?.id,
                  end_date: endDate,
                  passing_score: passingScore,
                },
                {
                  onSuccess() {
                    queryClient.invalidateQueries(getAssesmentById);
                    onClose();
                  },
                }
              );
            }}
          >
            Save
          </CustomButton>
        </Flex>
      </Flex>
    </CustomModal>
  );
}
