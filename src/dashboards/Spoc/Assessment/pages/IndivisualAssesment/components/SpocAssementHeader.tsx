import { Flex, useDisclosure } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { Pencil, Tick, Trash } from "react-huge-icons/outline";
import { useNavigate } from "react-router-dom";
import Status, {
  StatusTypes,
} from "../../../../../../components/common/Status";
import { systemColors } from "../../../../../../components/DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../../components/DesignSystem/CustomButton";
import CustomText from "../../../../../../components/DesignSystem/Typography/CustomText";
import { userStore } from "../../../../../../store/userStore";
import { BASE_ROUTES } from "../../../../../../utils/constants/constants";
import {
  formatDateString,
  formatTime,
} from "../../../../../../utils/helpers/formatDate";
import { editAtom } from "../../../atom";
import { IAssesmentDetails } from "../hooks/useGetAssesment";
import CancelAssesmentModal from "../modals/CancelAssesmentModal";
import EditDateTimeModal from "./EditDateTimeModal";
export default function SpocAssementHeader({
  data,
}: {
  data: IAssesmentDetails;
}) {
  const isDisabled =
    data?.status === StatusTypes.CANCELLED ||
    data?.status === StatusTypes.COMPLETED;
  const [edit, setEdit] = useAtom(editAtom);
  const { userType } = userStore();
  const config = [
    {
      label: "Passing percentage",
      value: `${data?.passing_score}%`,
    },
    {
      label: "Total Questions",
      value: data?.total_questions,
    },
    {
      label: "Start Date & Time",
      value: `${formatDateString(new Date(data?.start_date))}, ${formatTime(
        new Date(data?.start_date)
      )}`,
    },
    {
      label: "End Date & Time",
      value: `${formatDateString(new Date(data?.end_date))}, ${formatTime(
        new Date(data?.end_date)
      )}`,
    },
  ];
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isEditDateOpen,
    onClose: onEditDateClose,
    onOpen: onEditDateOpen,
  } = useDisclosure();
  return (
    <Flex
      w={"full"}
      gap={"24px"}
      flexDir={"column"}
      p={"24px"}
      bgColor={systemColors.white.absolute}
      borderRadius={"16px"}
    >
      <Flex justifyContent={"space-between"} w={"full"} alignItems={"center"}>
        <CustomText stylearr={[24, 31, 700]}>{data?.name}</CustomText>
        <Flex gap={"20px"} alignItems={"center"}>
          {edit ? (
            <CustomButton
              px={"24px"}
              borderRadius={"10px"}
              onClick={() => setEdit(false)}
              rightIcon={<Tick fontSize={"20px"} />}
            >
              Save
            </CustomButton>
          ) : (
            <>
              <CustomButton
                onClick={onOpen}
                borderColor={systemColors.black[400]}
                borderRadius={"10px"}
                bgColor={systemColors.black[50]}
                px={"24px"}
                variant="tertiary"
                rightIcon={<Trash fontSize={"20px"} />}
                isDisabled={isDisabled}
              >
                Cancel Assessment
              </CustomButton>
              <CustomButton
                px={"24px"}
                bgColor={systemColors.black[50]}
                borderColor={systemColors.black[400]}
                borderRadius={"10px"}
                variant="tertiary"
                onClick={() => {
                  if (data?.status === StatusTypes.DRAFTED) {
                    navigate(
                      `${BASE_ROUTES[userType]}/assessment/edit/${data?.id}`
                    );
                  } else if (
                    data?.status === StatusTypes.ONGOING ||
                    data?.status === StatusTypes.SCHEDULE
                  ) {
                    onEditDateOpen();
                  } else {
                    setEdit(true);
                  }
                }}
                isDisabled={isDisabled}
                rightIcon={<Pencil fontSize={"20px"} />}
              >
                Edit
              </CustomButton>
            </>
          )}
        </Flex>
      </Flex>
      <Flex gap={"40px"} flexWrap={"wrap"} justifyContent={"space-between"}>
        {config?.map((row, id) => (
          <Flex key={id} gap={2} flexDir={"column"}>
            <CustomText stylearr={[14, 18, 400]}>{row.label}</CustomText>
            <CustomText stylearr={[14, 18, 700]}>{row.value}</CustomText>
          </Flex>
        ))}
        <Flex gap={2} flexDir={"column"}>
          <CustomText stylearr={[14, 18, 400]}>{"Status"}</CustomText>
          {
            //@ts-ignore
            <Status w={"160px"} status={data?.status} />
          }
        </Flex>
      </Flex>
      <CancelAssesmentModal isOpen={isOpen} onClose={onClose} id={data?.id} />
      <EditDateTimeModal
        isOpen={isEditDateOpen}
        onClose={onEditDateClose}
        onSave={() => {}}
        data={data}
      />
    </Flex>
  );
}
