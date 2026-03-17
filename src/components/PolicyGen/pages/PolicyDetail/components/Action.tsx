import { Flex, Spinner, useDisclosure } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PolicyGenWhiteIcon from "../../../../../assets/Icons/PolicyGenWhiteIcon";
import useGetUserType from "../../../../../hooks/useGetUserType";
import { userStore } from "../../../../../store/userStore";
import {
  BASE_ROUTES,
  FeatureIdentifiers,
} from "../../../../../utils/constants/constants";
import { POLICYGEN_SUB_ROUTES } from "../../../../common/PolicyGen/utils/constants";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { rulesAtom, summaryAtom } from "../../../atom";
import useGetPolicyGenData, {
  PolicyGenData,
} from "../../../hooks/useGetPolicyGenData";
import useGetRuleGenerationStatus from "../../../hooks/useGetRuleGenerationStatus";
import useResetPolicyGenState from "../../PolicyGenBase/hooks/useResetPolicyGenState";
import PollingModal from "./PollingModal";

const MotionDiv = motion(Flex);
const variants = {
  initial: {
    background: `linear-gradient(95deg, ${systemColors.indigo[350]} -1.14%, ${systemColors.indigo[600]} 158.31%)`,
    height: "47px",
  },
  modal: {
    background: "#fff",
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    zIndex: 1,
    height: "372px",
    transition: {
      height: { delay: 0, duration: 0.3 },
      default: {
        duration: 0.3,
      },
    },
  },
};

export default function Action({ fileId }: { fileId: string }) {
  const { categoryId, policyId, id } = useParams<{
    categoryId: string;
    policyId: string;
    id: string;
  }>();
  const { enabledFeature } = userStore();
  const isPolyGenEnabled = enabledFeature?.includes(
    FeatureIdentifiers.RULESENSE,
  );
  if (!isPolyGenEnabled) return null;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [key, setKey] = useState(1);
  const { mutate, isLoading } = useGetPolicyGenData();
  const { data } = useGetRuleGenerationStatus(fileId);
  const rules = useAtomValue(rulesAtom);
  const summary = useAtomValue(summaryAtom);
  const navigate = useNavigate();
  const userType = useGetUserType();
  const [click, setClick] = useState<boolean>(false);
  const { resetPolicyGenState } = useResetPolicyGenState();
  useEffect(() => {
    setTimeout(() => resetPolicyGenState(), 0);
  }, []);

  const navigationRoute = `${
    BASE_ROUTES[userType]
  }/policygen/${POLICYGEN_SUB_ROUTES.POLICY_GEN_DATA?.replace(
    ":categoryId",
    categoryId!,
  )
    .replace(":policyId", policyId || id!)
    .replace(":fileId", fileId)}`;

  useEffect(() => {
    if (rules && summary && click) {
      setTimeout(() => navigate(navigationRoute), 50);
    }
  }, [rules, summary, fileId, click]);

  const config =
    data?.data === "Successful"
      ? {
          onClick: () => {
            mutate({ fileId: fileId, queryType: PolicyGenData.RULES });
            mutate({ fileId: fileId, queryType: PolicyGenData.SUMMARY });
          },
          title: "View Rules",
        }
      : data?.data === "Pending" || data?.data === "Failed"
        ? { onClick: onOpen, title: "Generate Rules" }
        : null;

  const handleClose = () => {
    setKey((prev) => prev + 1); // Reset animation state
    onClose();
  };

  return config === null ? null : (
    <>
      <MotionDiv
        key={key}
        whileTap={{ scale: 0.95 }}
        className={`justify-center items-center cursor-pointer ${
          isOpen ? "" : "fixed bottom-5 right-12 px-4"
        }`}
        zIndex={2}
        borderRadius={"12px"}
        animate={isOpen ? "modal" : "initial"}
        variants={variants}
        overflow={"hidden"}
        onClick={() => {
          if (!isOpen) {
            setClick(true);
            config?.onClick();
          }
        }}
      >
        {isOpen ? (
          <PollingModal
            fileId={fileId}
            onClose={handleClose}
            successRoute={navigationRoute}
          />
        ) : (
          <Flex
            className="items-center justify-center w-[135px] gap-2"
            h="47px"
            color="#fff"
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                {" "}
                <PolicyGenWhiteIcon width="16px" />
                <CustomText stylearr={[14, 20, 600]}>{config.title}</CustomText>
              </>
            )}
          </Flex>
        )}
      </MotionDiv>
      {isOpen && (
        <Flex className="fixed w-full h-full bg-[#000] opacity-10 top-0 left-0" />
      )}
    </>
  );
}
