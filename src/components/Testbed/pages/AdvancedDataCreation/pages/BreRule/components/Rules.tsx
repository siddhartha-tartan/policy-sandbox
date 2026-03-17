import { ChevronDownIcon } from "@chakra-ui/icons";
import { Collapse, Flex, StackDivider, VStack } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import RuleIcon from "../../../../../../../assets/Icons/RuleIcon";
import CustomCheckbox from "../../../../../../CustomCheckbox";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import CommonSearchBar from "../../../../../../common/CommonSearchBar";
import { rulesCheckedStateAtom } from "../../../advancedDataCreationAtom";
import useGetRule from "../../../hooks/useGetRule";
import { BsDot } from "react-icons/bs";

export default function Rules() {
  const { data, loading, error } = useGetRule();
  const [showDesc, setShowDesc] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [checkedState, setCheckedState] = useAtom(rulesCheckedStateAtom);
  const [selectAll, setSelectAll] = useState(true);

  useEffect(() => {
    if (data) {
      const initialCheckedState = data
        ?.flatMap((section) =>
          section?.rules?.map((rule) => ({ [rule?.id]: true }))
        )
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setCheckedState(initialCheckedState);
      setSelectAll(Object.values(initialCheckedState).every(Boolean));

      const initialShowDescState = data.reduce(
        (acc, section) => ({ ...acc, [section.id]: true }),
        {}
      );
      setShowDesc(initialShowDescState);
    }
  }, [data, setCheckedState]);

  const toggleShowDesc = useCallback((sectionId: any) => {
    setShowDesc((prevState) => ({
      ...prevState,
      //@ts-ignore
      [sectionId]: !prevState[sectionId],
    }));
  }, []);

  const handleOnChange = useCallback(
    (ruleId: string, event: any) => {
      event.stopPropagation();
      setCheckedState((prevState) => ({
        ...prevState,
        [ruleId]: !prevState[ruleId],
      }));
      setSelectAll(
        Object.values({
          ...checkedState,
          [ruleId]: !checkedState[ruleId],
        }).every(Boolean)
      );
    },
    [checkedState]
  );

  const toggleSelectAll = useCallback(() => {
    setSelectAll((prevState) => {
      const newState = !prevState;
      setCheckedState(
        Object.keys(checkedState).reduce(
          (acc, key) => ({ ...acc, [key]: newState }),
          {}
        )
      );
      return newState;
    });
  }, [checkedState]);

  const handleSearchChange = useCallback((e: any) => {
    setSearchTerm(e?.toLowerCase());
  }, []);

  const fuzzyMatch = useCallback((text: string, search: string) => {
    return text?.toLowerCase().includes(search?.toLowerCase());
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data
      ?.map((section) => {
        const sectionMatches = fuzzyMatch(section?.name, searchTerm);

        const filteredRules = section?.rules?.filter((rule) => {
          const ruleNameMatches = fuzzyMatch(rule?.name, searchTerm);
          const ruleDescriptionMatches = fuzzyMatch(
            rule?.description,
            searchTerm
          );
          const variableTitleMatches = rule?.variables?.some((variable) =>
            fuzzyMatch(variable?.title, searchTerm)
          );

          return (
            ruleNameMatches || ruleDescriptionMatches || variableTitleMatches
          );
        });

        return {
          ...section,
          rules: sectionMatches ? section.rules : filteredRules,
        };
      })
      ?.filter((section) => section?.rules?.length > 0);
  }, [data, searchTerm, fuzzyMatch]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error?.message}</div>;

  return (
    <div className="w-full bg-white rounded-[12px] flex flex-col flex-grow overflow-y-auto">
      <div className="border-b-[1px] px-6 gap-3 border-b-[#00000014] w-full h-[74px] min-h-[74px] items-center flex">
        <div onClick={toggleSelectAll}>
          <CustomCheckbox
            borderRadius="2px"
            color={"#3762DD"}
            isChecked={selectAll}
          />
        </div>
        <div className="flex gap-3 items-center">
          <CustomText stylearr={[16, 20, 700]}>
            BRE Rules (
            {filteredData?.flatMap((section) => section.rules).length})
          </CustomText>
        </div>
        <CommonSearchBar
          flexGrow={1}
          maxH={"44px"}
          h={"44px"}
          maxW={"425px"}
          py={2}
          px={4}
          handleChange={handleSearchChange}
          placeholder={"Find Rule"}
        />
      </div>
      <VStack className="overflow-y-auto flex-grow px-[16px] py-[16px] gap-3">
        {filteredData?.map((section, sectionIndex) => (
          <div
            key={`${sectionIndex}-${section.id}`}
            className="w-full justify-between items-center flex flex-col border-[1px] border-[#00000014] p-4 gap-4 rounded-[6px]"
            onClick={() => toggleShowDesc(section.id)}
          >
            <div className="w-full justify-between items-center flex">
              <div className="flex gap-2 items-center">
                <Flex className="min-w-5 h-5 w-5 justify-center items-center">
                  <RuleIcon />
                </Flex>
                <CustomText stylearr={[16, 20, 700]}>{section.name}</CustomText>
              </div>
              <div className="flex gap-4 items-center">
                <div
                  className="flex items-center gap-3 px-4 py-2 border-[1px] border-[#00000014] rounded-[8px]"
                  style={{
                    background:
                      "linear-gradient(230.95deg, rgba(55, 98, 221, 0) 13.46%, rgba(55, 98, 221, 0.2) 194.11%)",
                  }}
                >
                  <CustomText
                    stylearr={[14, 19, 700]}
                    style={{
                      background:
                        "linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Action
                  </CustomText>
                  <CustomText stylearr={[12, 16, 700]}>
                    {section.action}
                  </CustomText>
                </div>
                <ChevronDownIcon
                  fontSize={"25px"}
                  className="transition-all cursor-pointer"
                  transform={
                    //@ts-ignore
                    showDesc[section.id] ? "rotate(180deg)" : "rotate(0deg)"
                  }
                />
              </div>
            </div>
            <Collapse
              //@ts-ignore
              in={showDesc[section.id]}
              animateOpacity
              className="w-full"
            >
              <VStack
                divider={<StackDivider style={{ borderColor: "#F3F2F5" }} />}
                className="w-full flex-col flex gap-2"
              >
                {section?.rules?.map((rule, ruleIndex) => (
                  <div className="flex flex-row gap-2 w-full items-start mt-2">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOnChange(rule.id, e);
                      }}
                    >
                      <CustomCheckbox
                        borderRadius="2px"
                        color={"#3762DD"}
                        isChecked={checkedState[rule.id]}
                      />
                    </div>
                    <div
                      key={`${section.id}-${rule.id}`}
                      className="gap-4 flex flex-col w-full"
                    >
                      <div className="flex gap-2 items-center">
                        <CustomText
                          stylearr={[14, 20, 700]}
                          className="text-[#111827]"
                        >
                          Rule {ruleIndex + 1}: {rule.name}
                        </CustomText>
                      </div>
                      <CustomText
                        stylearr={[12, 16, 500]}
                        key={`${rule.name}`}
                        className="text-[#555557]"
                      >
                        {rule.description}
                      </CustomText>
                      <div className="flex flex-col gap-2">
                        <CustomText stylearr={[12, 17, 700]}>
                          Variables Detected
                        </CustomText>
                        {rule?.variables?.map((variable) => (
                          <div className="flex flex-row gap-1 w-full items-center">
                            <BsDot fontSize={"20px"} />
                            <CustomText
                              stylearr={[12, 16, 500]}
                              key={`${rule.id}-${variable.id}`}
                              className="text-[#555557]"
                            >
                              {variable.title}
                            </CustomText>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </VStack>
            </Collapse>
          </div>
        ))}
      </VStack>
    </div>
  );
}
