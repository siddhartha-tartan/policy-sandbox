import { Divider, Flex, Spinner } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState, useCallback } from "react";
import { Trash } from "react-huge-icons/outline";
import { BsDot } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import RuleIcon from "../../../../../../assets/Icons/RuleIcon";
import EventBus from "../../../../../../EventBus";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import { rulesAtom, rulesLoadingAtom } from "../../../../atom";
import useGetEditRules from "../../hooks/useGetEditRules";
import { ruleEditKeyAtom, tempRulesAtom } from "../../threadAtom";
import AnimatedSkeleton from "../AnimatedSkeleton";
import { EVENT_DELETE_RULE } from "./DeleteRuleConfirmModal";
import { serializeJson } from "../../../../../../utils/helpers/serializeJson";

const MotionFlex = motion(Flex);
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
    },
  },
};

const ruleVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};
export default function RuleEngine({
  title = "",
  data = [],
}: {
  title?: string;
  data?: string[];
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [ruleData, setRulesData] = useAtom(rulesAtom);
  const [temp, setTemp] = useAtom(tempRulesAtom);
  const [ruleEditKey, setRuleEditKey] = useAtom(ruleEditKeyAtom);
  const { mutate, isLoading } = useGetEditRules();
  const isRulesLoading = useAtomValue(rulesLoadingAtom);

  useEffect(() => {
    setTemp(ruleData);
  }, [ruleData]);

  const loading = isLoading || isRulesLoading;

  const onSave = useCallback(() => {
    mutate({ queryType: "manual_update", rules: serializeJson(temp) });
    setRulesData(temp);
    setIsEdit(false);
    setRuleEditKey("");
  }, [mutate, temp, setRulesData, setRuleEditKey]);

  const onCancel = useCallback(() => {
    setTemp(ruleData);
    setIsEdit(false);
    setRuleEditKey("");
  }, [ruleData, setTemp, setIsEdit, setRuleEditKey]);

  const onStartEdit = useCallback(() => {
    setIsEdit(true);
    setRuleEditKey(title);
  }, [setIsEdit, setRuleEditKey, title]);

  const handleRuleContentChange = useCallback(
    (id: number, value: string) => {
      const updatedRules =
        data?.map((item, index) => (index === id ? value : item)) || [];
      setTemp({ ...temp, [title]: updatedRules });
    },
    [data, temp, title, setTemp]
  );

  const handleDeleteRule = useCallback(
    (id: number) => {
      const onRemove = () => {
        const updatedRules = data?.filter((_, index) => index !== id);
        setTemp({ ...temp, [title]: updatedRules });
      };
      EventBus.getInstance().fireEvent(EVENT_DELETE_RULE, onRemove);
    },
    [data, temp, title, setTemp]
  );

  const handleAddRule = useCallback(() => {
    const rules = [...data, ""];
    setTemp({ ...temp, [title]: rules });
  }, [data, temp, title, setTemp]);

  return (
    <MotionFlex
      className="w-full p-4 border-[1px] border-[#ECEFF1] rounded-[16px] gap-3 flex-col flex"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {!ruleData ? (
        <Flex className="flex-col gap-2">
          {Array.from({ length: 2 }, (_, id) => (
            <AnimatedSkeleton
              key={`skeleon-${id}`}
              className="p-2 bg-[#FAFAFA] rounded-[12px] text-[#37474F] items-center gap-2 h-[40px]"
            />
          ))}
        </Flex>
      ) : (
        <>
          <Flex className="w-full justify-between items-center">
            <Flex className="items-center gap-2">
              <RuleIcon />
              <CustomText stylearr={[14, 22, 800]} color={"#111827"}>
                {title}
              </CustomText>
            </Flex>
            <Flex className="gap-4 items-center">
              {isEdit ? (
                <>
                  {!loading && (
                    <MotionFlex
                      onClick={onCancel}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer px-4 py-2 gap-1 items-center border-[1px] border-[#F3F2F5] rounded-[8px] w-[72px] justify-center"
                    >
                      <CustomText stylearr={[12, 18, 600]}>Cancel</CustomText>
                    </MotionFlex>
                  )}
                  <MotionFlex
                    onClick={onSave}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer px-4 py-2 gap-1 items-center border-[1px] border-[#F3F2F5] rounded-[8px] w-[72px] justify-center"
                  >
                    {loading ? (
                      <Spinner size={"sm"} />
                    ) : (
                      <CustomText stylearr={[12, 18, 600]}>Save</CustomText>
                    )}
                  </MotionFlex>
                </>
              ) : (
                <>
                  {!ruleEditKey && (
                    <MotionFlex
                      onClick={onStartEdit}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer px-4 py-2 gap-1 items-center border-[1px] border-[#F3F2F5] rounded-[8px]"
                      opacity={isEdit ? 0 : 1}
                    >
                      <CustomText stylearr={[12, 18, 600]}>Edit</CustomText>
                      <MdModeEdit fontSize={"16px"} />
                    </MotionFlex>
                  )}
                </>
              )}
            </Flex>
          </Flex>
          <Divider />
          <MotionFlex
            className="flex-col gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {data?.map((row, id) => (
              <MotionFlex
                key={`${row}-${id}`}
                className="p-2 bg-[#FAFAFA] rounded-[12px] text-[#37474F] items-center gap-2"
                variants={ruleVariants}
              >
                <BsDot />
                <CustomText
                  contentEditable={isEdit && !loading}
                  onBlur={(e) => {
                    const val = e.currentTarget.textContent || "";
                    handleRuleContentChange(id, val);
                  }}
                  stylearr={[14, 22, 500]}
                  className="w-full h-full focus:border-none focus:outline-none break-all"
                >
                  {row}
                </CustomText>
                {isEdit && !loading && (
                  <Flex
                    onClick={() => handleDeleteRule(id)}
                    className="w-[20px] min-w-[20px] h-[20px] justify-center items-center text-[#BF360C] cursor-pointer hover:brightness-110"
                  >
                    <Trash />
                  </Flex>
                )}
              </MotionFlex>
            ))}
            {isEdit && !loading && (
              <MotionFlex
                whileTap={{ scale: 0.95 }}
                onClick={handleAddRule}
                className={
                  "w-full h-[36px] justify-center items-center cursor-pointer bg-[#F5F9FF] border-[1px] border-[rgba(0, 116, 255, 0.20)] rounded-[12px] gap-1 text-[#0074FF]"
                }
              >
                <CustomText stylearr={[14, 22, 600]}>Add</CustomText>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 8H12M8 12V4"
                    stroke="#0074FF"
                    strokeWidth={1.5}
                    strokeMiterlimit={10}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </MotionFlex>
            )}
          </MotionFlex>
        </>
      )}
    </MotionFlex>
  );
}
