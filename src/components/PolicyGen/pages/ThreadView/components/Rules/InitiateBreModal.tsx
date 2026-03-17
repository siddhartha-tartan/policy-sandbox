import { CloseIcon } from "@chakra-ui/icons";
import { Flex, Select, useDisclosure } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PolicyGenWhiteIcon from "../../../../../../assets/Icons/PolicyGenWhiteIcon";
import EventBus from "../../../../../../EventBus";
import { userStore } from "../../../../../../store/userStore";
import { BASE_ROUTES } from "../../../../../../utils/constants/constants";
import CustomModal from "../../../../../common/CustomModal";
import { systemColors } from "../../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import useGenerateCode, { CodeLanguage } from "../../hooks/useGenerateCode";
import { codeRequestIdAtom } from "../../threadAtom";
import { PolicyGenParamsEnum } from "../../utils/constant";
import { EVENT_OPEN_GENERATE_PROCESSING } from "./GenerateProcessingModal";

export const EVENT_INITIATE_BRE_OPEN_MODAL = "EVENT_INITIATE_BRE_OPEN_MODAL";
export default function InitiateBreModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>(
    CodeLanguage.DROOLS
  );

  useEffect(() => {
    const onOpenModal = () => {
      onOpen();
    };

    EventBus.getInstance().addListener(
      EVENT_INITIATE_BRE_OPEN_MODAL,
      onOpenModal
    );
    return () => EventBus.getInstance().removeListener(onOpenModal);
  }, []);

  const { mutate, isLoading, data } = useGenerateCode();
  const requestId =
    useAtomValue(codeRequestIdAtom) ||
    new URLSearchParams(location.search).get(PolicyGenParamsEnum.CODE_ID)! ||
    data?.id;

  useEffect(() => {
    if (requestId) {
      onClose();
      EventBus.getInstance().fireEvent(EVENT_OPEN_GENERATE_PROCESSING, {
        type: "generate",
      });
    }
  }, [requestId]);

  const navigate = useNavigate();
  const { userType } = userStore();

  const getLanguageDisplayName = (language: CodeLanguage): string => {
    const languageMap = {
      [CodeLanguage.DROOLS]: "Drools",
      [CodeLanguage.PYTHON]: "Python",
      [CodeLanguage.JSONATA]: "JSONata",
      [CodeLanguage.JAVA]: "Java",
    };
    return languageMap[language];
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLanguage = event.target.value as CodeLanguage;
    setSelectedLanguage(newLanguage);
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <Flex w={"398px"} className="rounded-[12px] flex-col bg-white p-6 gap-6">
        <Flex className="gap-[18px] w-full justify-between items-center">
          <CustomText className="text-center" stylearr={[24, 35, 700]}>
            BRE update is initiated
          </CustomText>
          <CloseIcon onClick={onClose} />
        </Flex>
        <Flex className="flex-col gap-[19px]">
          <Flex className="flex-col gap-3">
            <CustomText stylearr={[16, 24, 700]} color={"#475467"}>
              Code Language
            </CustomText>
            <Select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              size="sm"
              bg="white"
              border="1px solid #E4E7EC"
              borderRadius="6px"
            >
              {Object.values(CodeLanguage).map((language) => (
                <option key={language} value={language}>
                  {getLanguageDisplayName(language)}
                </option>
              ))}
            </Select>
          </Flex>
          <CustomText stylearr={[16, 24, 700]} color={"#475467"}>
            Pending Approvals
          </CustomText>
          {[
            {
              name: "Anmol Jain",
              status: "Pending Approval",
              position: "Policy Head",
            },
            {
              name: "Archit Raheja",
              status: "Pending Approval",
              position: "Program Head",
            },
          ]?.map((row, id) => {
            return (
              <Flex
                key={`review-${id}`}
                className="justify-between w-full p-4 items-center bg-[#F3F2F5] rounded-[8px]"
              >
                <Flex className="flex-col gap-2">
                  <CustomText stylearr={[16, 24, 500]}>{row.name}</CustomText>
                  <CustomText stylearr={[12, 12, 500]}>
                    {row.position}
                  </CustomText>
                </Flex>
                <Flex className="bg-[#E8EAF6] rounded-[4px] p-1 text-[#1A237E]">
                  <CustomText stylearr={[12, 19, 500]}>{row.status}</CustomText>
                </Flex>
              </Flex>
            );
          })}
        </Flex>
        <Flex className="w-full gap-6">
          <CustomButton
            variant="secondary"
            color={"#3762DD"}
            className="flex-1"
            border={"1px solid #3762DD"}
            onClick={() => {
              onClose();
              navigate(`${BASE_ROUTES[userType]}/policygen`);
            }}
          >
            <Flex className="items-center gap-2">
              {/* <CloseIcon fontSize={"10px"} /> */}
              <CustomText stylearr={[14, 20, 600]}>Go to Dashboard</CustomText>
            </Flex>
          </CustomButton>
          <CustomButton
            style={{
              background: `linear-gradient(95deg, ${systemColors.indigo[350]} -1.14%, ${systemColors.indigo[600]} 158.31%)`,
            }}
            h={"47px"}
            isLoading={isLoading}
            onClick={() => {
              mutate({ codeLanguage: selectedLanguage });
            }}
            className="flex-1"
          >
            <Flex className="items-center gap-2">
              <PolicyGenWhiteIcon width="16px" />
              <CustomText stylearr={[14, 20, 600]}>Generate Code</CustomText>
            </Flex>
          </CustomButton>
        </Flex>
      </Flex>
    </CustomModal>
  );
}
