import { ChevronRightIcon } from "@chakra-ui/icons";
import { Flex, Spinner, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetAssesment from "../../../../dashboards/Spoc/Assessment/pages/IndivisualAssesment/hooks/useGetAssesment";
import { isAbfl } from "../../../../utils/constants/endpoints";
import { formatDateTimeString } from "../../../../utils/helpers/formatDate";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../DesignSystem/CustomButton";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import McqBox from "../../McqBox";
import useSubmitAttempt from "../hooks/useSubmitAttempt";
import AnalysingModal from "./components/AnalysingModal";
import IncompleteModal from "./components/IncompleteModal";
import SubmitAssesmentModal from "./components/SubmitAssesmentModal";
import TimeupModal from "./components/TimeupModal";

export default function AttemptAssesment() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { data, isLoading } = useGetAssesment();
  const navigate = useNavigate();
  const {
    isOpen: isTimeUpOpen,
    //@ts-ignore
    onClose: onTimeUpClose,
    //@ts-ignore
    onOpen: onTimeUpOpen,
  } = useDisclosure();

  const {
    isOpen: isIncompleteOpen,
    onClose: onIncompleteClose,
    //@ts-ignore
    onOpen: onIncompleteOpen,
  } = useDisclosure();

  const {
    isOpen: isAnalyzingOpen,
    onClose: onAnalyzingClose, //@ts-ignore
    onOpen: onAnalyzingOpen,
  } = useDisclosure();

  const [answers, setAnswers] = useState<string[]>(
    Array(data?.total_questions).fill("")
  );

  const { mutate, isLoading: isSubmitLoading } = useSubmitAttempt();
  const onSubmit = () => {
    const payload: any = [];
    data?.questions?.some((row) => {
      const question_id = row?.id;
      row?.options?.some((col) => {
        if (answers.includes(col?.value))
          payload.push({ question_id: question_id, option_id: col?.value });
      });
    });
    mutate(payload, {
      onSuccess() {
        navigate(-1);
      },
    });
  };

  useEffect(() => {
    if (!data?.end_date) return;
    const endDate = new Date(data.end_date).getTime();
    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      if (currentTime >= endDate) {
        onTimeUpOpen();
        clearInterval(intervalId);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [data, onTimeUpOpen]);

  const isDisabled = () => {
    const payload: any = [];
    data?.questions?.some((row) => {
      const question_id = row?.id;
      row?.options?.some((col) => {
        if (answers.includes(col?.value))
          payload.push({ question_id: question_id, option_id: col?.value });
      });
    });
    return payload.length !== data?.questions?.length;
  };

  if (isLoading || !data)
    return (
      <Flex
        p={"24px"}
        bgColor={systemColors.white.absolute}
        borderRadius={"16px"}
        gap={"20px"}
        flexDir={"column"}
      >
        <Flex gap={2} flexDir={"column"}>
          <CustomText stylearr={[24, 31, 700]}>Assessment Name</CustomText>
        </Flex>
        <Flex w={"full"} justifyContent={"center"}>
          <Spinner />
        </Flex>
      </Flex>
    );

  return (
    <Flex
      w={"full"}
      flexDir={"column"}
      alignItems={"center"}
      bgColor={"#fafafa"}
      justifyContent={"center"}
    >
      <Flex w={"80%"} gap={"24px"} flexDir={"column"}>
        <Flex
          w={"full"}
          justifyContent={"space-between"}
          alignItems={"center"}
          borderRadius={"16px"}
          bgColor={systemColors.white.absolute}
          p={"24px"}
        >
          <Flex className="flex flex-col gap-2">
            <CustomText stylearr={[24, 31, 700]}>{data?.name}</CustomText>
            {isAbfl && (
              <CustomText stylearr={[14, 18, 600]} className="text-[#FF5722]">
                Note : This assessment is not part of the L&D assessment, and
                CAD allotment is not dependent on it.
              </CustomText>
            )}
          </Flex>
          <CustomButton
            borderRadius={"10px"}
            isDisabled={isDisabled()}
            rightIcon={<ChevronRightIcon fontSize={"24px"} />}
            onClick={() => {
              let flag = false;
              answers.some((row) => {
                if (row === "") {
                  flag = true;
                }
                return flag; // Return a value to exit early when the condition is met
              });
              if (flag) onIncompleteOpen();
              else onOpen();
            }}
          >
            Submit
          </CustomButton>
        </Flex>
        <Flex
          w={"full"}
          bgColor={systemColors.white.absolute}
          alignItems={"center"}
          gap={"66px"}
          borderRadius={"16px"}
          p={"16px 24px"}
        >
          <Flex gap={2} alignItems={"center"}>
            <CustomText stylearr={[14, 18, 400]}>Passing percentage</CustomText>
            <CustomText stylearr={[14, 18, 700]}>
              {data?.passing_score}%
            </CustomText>
          </Flex>
          <Flex gap={2} alignItems={"center"}>
            <CustomText stylearr={[14, 18, 400]}>Total Questions</CustomText>
            <CustomText stylearr={[14, 18, 700]}>
              {data?.questions?.length}
            </CustomText>
          </Flex>
          <Flex gap={2} alignItems={"center"}>
            <CustomText stylearr={[14, 18, 400]}>Due Date & Time</CustomText>
            <CustomText stylearr={[14, 18, 700]}>
              {formatDateTimeString(new Date(data?.end_date))}
            </CustomText>
          </Flex>
        </Flex>
        {data?.questions?.map((row, id) => (
          <McqBox
            value={answers[id]}
            onChange={(e) => {
              const updatedAnswers = [...answers];
              updatedAnswers[id] = e;
              setAnswers(updatedAnswers);
            }}
            index={id + 1}
            question={row.question}
            options={row.options}
          />
        ))}
      </Flex>
      <SubmitAssesmentModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={onSubmit}
        isLoading={isSubmitLoading}
      />
      <TimeupModal
        isOpen={isTimeUpOpen}
        onClose={() => {}}
        onSave={() => {
          navigate("/");
        }}
      />
      <IncompleteModal
        isOpen={isIncompleteOpen}
        onClose={onIncompleteClose}
        onSave={onIncompleteClose}
      />
      <AnalysingModal isOpen={isAnalyzingOpen} onClose={onAnalyzingClose} />
    </Flex>
  );
}
