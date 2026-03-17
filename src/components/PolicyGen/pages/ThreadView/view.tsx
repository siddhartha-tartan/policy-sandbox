import { Flex } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatSvg from "../../../../assets/Icons/ChatSvg";
import useGetUserType from "../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../utils/constants/constants";
import ComparisonProcessingModal from "../../../common/ComparePolicy/components/ComparisonProcessingModal";
import PolicyComparisonTab from "../../../common/ComparePolicy/components/PolicyComparisonTab";
import HeaderBackCta from "../../../common/HeaderBackCta";
import useGetPolicyDetails from "../../../common/Policy/hooks/useGetPolicyDetails";
import { POLICYGEN_SUB_ROUTES } from "../../../common/PolicyGen/utils/constants";
import CodeFooter from "./components/CodeFooter";
import CodeView from "./components/CodeView";
import ComingSoonModal from "./components/ComingSoonModal";
import AddRuleModal from "./components/Rules/AddRuleModal";
import ChatBox from "./components/Rules/ChatBox";
import CompareModal from "./components/Rules/CompareModal";
import ConfirmGenerateModal from "./components/Rules/ConfirmGenerateModal";
import DeleteRuleConfirmModal from "./components/Rules/DeleteRuleConfirmModal";
import GenerateProcessingModal from "./components/Rules/GenerateProcessingModal";
import GenerateVariableMappingModal from "./components/Rules/GenerateVariableMappingModal";
import InitiateBreModal from "./components/Rules/InitiateBreModal";
import RuleFooter from "./components/Rules/RuleFooter";
import Rules from "./components/Rules/Rules";
import Versions from "./components/Rules/Versions";
import SentSuccessModal from "./components/SentSuccess";
import Stepper from "./components/Stepper";
import TestComingSoonModal from "./components/TestComingSoonModal";
import TestFooter from "./components/Tests/TestFooter";
import Tests from "./components/Tests/view";
import {
  comparePolicyAtom,
  isChatOpenAtom,
  isFullScreenAtom,
  stepAtom,
} from "./threadAtom";

export const MotionWrapper = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      key={id}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -500, opacity: 0.1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.2,
        delay: 0,
      }}
      className="flex w-full gap-4 transition-all"
    >
      {children}
    </motion.div>
  );
};

export default function ThreadView() {
  const step = useAtomValue(stepAtom);
  const { policyId, categoryId, fileId } = useParams<{
    policyId: string;
    categoryId: string;
    fileId: string;
  }>();
  const navigate = useNavigate();
  const userType = useGetUserType();
  const { versionData } = useGetPolicyDetails(categoryId, policyId);
  const isCompareTab = useAtomValue(comparePolicyAtom);
  const [isChatOpen, setIsChatOpen] = useAtom(isChatOpenAtom);

  useEffect(() => {
    if (!categoryId || !policyId || !fileId) {
      navigate(`${BASE_ROUTES[userType]}/policygen}`);
    }
  }, [policyId, categoryId, fileId]);

  const render = () => {
    switch (step) {
      case 0:
        return (
          <MotionWrapper id={`step-0`}>
            <Flex className="gap-4 flex-col w-full overflow-y-auto">
              <Versions />
              {isCompareTab ? (
                <PolicyComparisonTab data={versionData} />
              ) : (
                <Rules showSpliit />
              )}
            </Flex>
            {isChatOpen && <ChatBox />}
            {!isChatOpen && (
              <div
                className="fixed bottom-5 right-0 z-10 cursor-pointer"
                onClick={() => setIsChatOpen(true)}
              >
                <ChatSvg />
              </div>
            )}
          </MotionWrapper>
        );
      case 1:
        return (
          <MotionWrapper id={`step-1`}>
            <CodeView />
          </MotionWrapper>
        );
      case 2:
        return (
          <MotionWrapper id={`step-2`}>
            <Tests />
          </MotionWrapper>
        );
      default:
        return (
          <MotionWrapper id={`step-3`}>
            <></>
          </MotionWrapper>
        );
    }
  };

  const renderFooter = () => {
    switch (step) {
      case 0:
        return (
          <MotionWrapper id={`footer-step-1`}>
            <RuleFooter />
          </MotionWrapper>
        );
      case 1:
        return (
          <MotionWrapper id={`footer-step-2`}>
            <CodeFooter />
          </MotionWrapper>
        );
      case 2:
        return (
          <MotionWrapper id={`footer-step-3`}>
            <TestFooter />
          </MotionWrapper>
        );
      default:
        return <></>;
    }
  };
  const isFullScreen = useAtomValue(isFullScreenAtom);

  const backRoute = useMemo(() => {
    if (!categoryId || !policyId || !fileId) return "";

    return `${
      BASE_ROUTES[userType]
    }/policygen/${POLICYGEN_SUB_ROUTES.POLICY_DETAILS?.replace(
      ":categoryId",
      categoryId!
    )
      .replace(":policyId", policyId)
      .replace(":fileId", fileId)}`;
  }, [categoryId, policyId, fileId, userType]);

  return (
    <>
      <HeaderBackCta navigateTo={backRoute} />
      <motion.div
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100vh", opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`${
          isFullScreen ? "" : "px-[24px] pt-4"
        } w-full flex-col overflow-y-auto flex transition-all h-full ${
          step > 0 ? "bg-white gap-[32px]" : "gap-4"
        }`}
      >
        <AnimatePresence mode="wait">
          {!isFullScreen && (
            <motion.div
              key="stepper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Stepper />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Animate step changes */}
        <Flex className="gap-4 flex-grow overflow-y-auto w-full h-full transition-all">
          <AnimatePresence mode="wait">{render()}</AnimatePresence>
        </Flex>
        {/* Animate footer changes */}
        <AnimatePresence mode="wait">
          {!isFullScreen && (
            <Flex className="min-h-[72px] items-center rounded-[12px] bg-white">
              <AnimatePresence mode="wait">{renderFooter()}</AnimatePresence>
            </Flex>
          )}
        </AnimatePresence>
      </motion.div>
      <ConfirmGenerateModal />
      <InitiateBreModal />
      <GenerateProcessingModal />
      {/* <InviteYourCustomerModal /> */}
      <DeleteRuleConfirmModal />
      <SentSuccessModal />
      <ComingSoonModal />
      <CompareModal />
      <AddRuleModal />
      <ComparisonProcessingModal />
      <GenerateVariableMappingModal />
      <TestComingSoonModal />
    </>
  );
}
