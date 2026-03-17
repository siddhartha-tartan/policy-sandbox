import { Divider, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import { DocumentText } from "react-huge-icons/solid";
import { PiSquareSplitHorizontalFill } from "react-icons/pi";
import { useParams } from "react-router-dom";
import RuleIcon from "../../../../../../assets/Icons/RuleIcon";
import EventBus from "../../../../../../EventBus";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import { rulesAtom, summaryAtom } from "../../../../atom";
import useGetPolicyGenData, {
  PolicyGenData,
} from "../../../../hooks/useGetPolicyGenData";
import { ruleEditKeyAtom, tabAtom, tempRulesAtom } from "../../threadAtom";
import SaveFirstPopover from "../SaveFirstPopover";
import BreRules from "./BreRules";
import { EVENT_OPEN_COMPARE_MODAL } from "./CompareModal";
import RuleEngine from "./RuleEngine";
import Summary from "./Summary";
import useGetBreRules from "../../../../hooks/useGetBreRules";

interface Props {
  readonly highlight?: string;
  readonly showSpliit?: boolean;
}

export default function Rules({ showSpliit = false }: Props) {
  const tempRules = useAtomValue(tempRulesAtom);
  const [tab, setTab] = useAtom(tabAtom);
  const ruleEditKey = useAtomValue(ruleEditKeyAtom);
  const canSwitchTabToSummary = !ruleEditKey;
  const rules = useAtomValue(rulesAtom);
  const summary = useAtomValue(summaryAtom);
  const { fileId } = useParams<{
    fileId: string;
  }>();
  const { mutate } = useGetPolicyGenData();
  useGetBreRules(fileId!);

  const fetchMissingData = useCallback(() => {
    const missingQueries: PolicyGenData[] = [];
    if (fileId) {
      if (!rules) missingQueries.push(PolicyGenData.RULES);
      if (!summary) missingQueries.push(PolicyGenData.SUMMARY);

      if (missingQueries.length > 0) {
        missingQueries.forEach((queryType) => mutate({ fileId, queryType }));
      }
    }
  }, [rules, summary, fileId]);

  useEffect(() => {
    if (!rules || !Object.entries(rules)?.length || !summary) {
      fetchMissingData();
    }
  }, [rules, summary]);

  const rulesContent = tempRules
    ? Object.entries(tempRules)?.map((row, id) => {
        return (
          <motion.div
            key={`rule-${id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: id * 0.4,
              duration: 0.3,
              ease: "easeOut",
            }}
            className="w-full"
          >
            <RuleEngine title={row[0]} data={row[1]} />
          </motion.div>
        );
      })
    : Array.from({ length: 4 }, (_, id) => (
        <motion.div
          key={`rule-loading-${id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: id * 0.4, // Stagger animation
            duration: 0.3,
            ease: "easeOut",
          }}
          className="w-full"
        >
          <RuleEngine key={id} />
        </motion.div>
      ));

  const tabContent = () => {
    switch (tab) {
      case "rule": {
        return (
          <div className="flex flex-col gap-6 overflow-y-auto py-6">
            {rulesContent}
          </div>
        );
      }
      case "summary": {
        return <Summary data={summary} />;
      }
      case "bre-rule": {
        return <BreRules />;
      }
      default: {
        return rulesContent;
      }
    }
  };

  return (
    <>
      <Flex className="flex-grow flex-col h-full overflow-y-auto rounded-[12px] bg-white">
        <Flex className="min-h-[70px] h-[70px] px-4 justify-between items-center">
          <div className="flex items-center h-full">
            <Flex
              onClick={() => setTab("rule")}
              className={`gap-3 items-center px-4 cursor-pointer h-full ${
                tab === "rule" ? "text-[#0074FF] bg-[#F5F9FF]" : ""
              }`}
            >
              <Flex className="min-w-5 h-5 justify-center items-center">
                <RuleIcon />
              </Flex>
              <CustomText stylearr={[16, 22, 700]} noOfLines={1}>
                Rules
              </CustomText>
            </Flex>
            <SaveFirstPopover showContent={!canSwitchTabToSummary}>
              <Flex
                onClick={() => {
                  if (canSwitchTabToSummary) setTab("summary");
                }}
                className={`gap-3 items-center px-4 cursor-pointer h-full ${
                  tab === "summary" ? "text-[#0074FF] bg-[#F5F9FF]" : ""
                } ${
                  canSwitchTabToSummary ? "" : "opacity-70 cursor-not-allowed"
                }`}
              >
                <Flex className="min-w-5 h-5 justify-center items-center">
                  <DocumentText fontSize={"20px"} />
                </Flex>
                <CustomText stylearr={[16, 22, 700]} noOfLines={1}>
                  Summary
                </CustomText>
              </Flex>
            </SaveFirstPopover>

            <SaveFirstPopover showContent={!canSwitchTabToSummary}>
              <Flex
                onClick={() => setTab("bre-rule")}
                className={`gap-3 items-center px-4 cursor-pointer h-full ${
                  tab === "bre-rule" ? "text-[#0074FF] bg-[#F5F9FF]" : ""
                }`}
              >
                <Flex className="min-w-5 h-5 justify-center items-center">
                  <RuleIcon />
                </Flex>
                <CustomText stylearr={[16, 22, 700]} noOfLines={1}>
                  BRE-Rules
                </CustomText>
              </Flex>
            </SaveFirstPopover>
          </div>
          {showSpliit && (
            <CustomButton
              w={"220px"}
              variant="secondary"
              className="w-fit border-none text-[#0074FF] h-full shadow-none"
              onClick={() => {
                EventBus.getInstance().fireEvent(EVENT_OPEN_COMPARE_MODAL);
              }}
            >
              <Flex className="items-center gap-2">
                <PiSquareSplitHorizontalFill />
                <CustomText stylearr={[14, 20, 700]}>Split View</CustomText>
              </Flex>
            </CustomButton>
          )}
        </Flex>
        <Divider />
        <Flex className="flex-col flex-grow px-4 h-full gap-6 w-full overflow-y-auto">
          {tabContent()}
        </Flex>
      </Flex>
    </>
  );
}
