import { useAtom } from "jotai";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { TbCaretUpDownFilled } from "react-icons/tb";
import EventBus from "../../../../../../../EventBus";
import CustomInput from "../../../../../../common/CustomInput";
import CustomCheckbox from "../../../../../../CustomCheckbox";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import { ruleConfigsAtom } from "../../../advancedDataCreationAtom";
import { Variable } from "../../../hooks/useGetVariables";
import { EVENT_OPEN_OPTION_MODAL } from "./AddOptionModal";
import { InfoOutlineIcon } from "@chakra-ui/icons";

interface RuleConfigProps {
  rule: Variable;
}

function getStepSize(min: number, max: number, defaultStep = 1): string {
  if (min >= max) return defaultStep.toString();

  const rawStep = (max - min) / 100;
  const step = Math.round(rawStep / 10) * 10;
  return (step || defaultStep).toString();
}

const RuleConfig: React.FC<RuleConfigProps> = ({ rule }) => {
  const getMinValue = () => {
    if (rule?.min_value) {
      return rule.min_value;
    } else {
      if (rule?.max_value) {
        return rule?.max_value;
      }
      return 0;
    }
  };

  const getMaxValue = () => {
    if (rule?.max_value) {
      return rule.max_value;
    } else {
      if (rule?.min_value) {
        return rule?.min_value;
      }
      return 100;
    }
  };

  const [stepSize, setStepSize] = useState<string>(
    getStepSize(rule?.min_value, rule?.max_value, 1)
  );
  const [minValue, setMinValue] = useState<number>(getMinValue());
  const [maxValue, setMaxValue] = useState<number>(getMaxValue());
  const [errorText, setErrorText] = useState<string>("");

  const [selectedOptions, setSelectedOptions] = useState<boolean[]>(
    rule?.type === "enum" && rule.values ? rule.values.map(() => true) : []
  );

  const [booleanValues, setBooleanValues] = useState<Set<boolean>>(
    new Set([true, false])
  );

  const [_, setRuleConfigs] = useAtom(ruleConfigsAtom);

  // Check if variable is in error state (no options selected for enum/string type)
  const isInErrorState = useMemo(() => {
    return (
      (rule?.type === "enum" || rule?.type === "string") &&
      (!selectedOptions.includes(true) ||
        !rule?.values ||
        rule.values.length === 0)
    );
  }, [rule, selectedOptions]);

  // Update the atom whenever configuration changes
  useEffect(() => {
    let configData: any = {};

    if (rule?.type === "integer" || rule?.type === "float") {
      configData = {
        datatype: rule?.type,
        min: minValue,
        max: maxValue,
        step:
          rule?.type === "integer"
            ? parseInt(getStepSize(minValue, maxValue, 1))
            : parseFloat(getStepSize(minValue, maxValue, 1)),
      };
    } else if (rule?.type === "enum" || rule?.type === "string") {
      configData = {
        datatype: "enum",
        values: rule?.values?.filter((_, index) => selectedOptions?.[index]),
      };
    } else if (rule?.type === "boolean") {
      configData = {
        datatype: "boolean",
        values: [...booleanValues],
      };
    }

    setRuleConfigs((prev) => ({
      ...prev,
      [rule.name]: configData,
    }));
  }, [
    rule,
    minValue,
    maxValue,
    stepSize,
    selectedOptions,
    booleanValues,
    setRuleConfigs,
  ]);

  useEffect(() => {
    setStepSize(getStepSize(minValue, maxValue, 1));
    if (minValue > maxValue) {
      setErrorText("Minimum value cannot be greater than maximum value!");
    } else {
      setErrorText("");
    }
  }, [minValue, maxValue]);

  const handleStepSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStepSize(e.target.value);
  };

  const handleMinValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMinValue(parseFloat(e.target.value));
  };

  const handleMaxValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMaxValue(parseFloat(e.target.value));
  };

  const handleOptionChange = (index: number) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index] = !updatedOptions[index];
    setSelectedOptions(updatedOptions);
  };

  const possibleValuesCount = useMemo(() => {
    if (rule?.type === "integer" || rule?.type === "float") {
      const range = Number(maxValue) - Number(minValue);
      const steps = range / Number(stepSize);
      return Math.floor(steps) + 1; // Assuming inclusive range
    } else if (rule?.type === "enum" || rule?.type === "string") {
      return rule?.values?.length || 0;
    } else if (rule?.type === "boolean") {
      return 2; // True or False
    }
    return 0; // Default case if none of the above
  }, [rule, maxValue, minValue, stepSize]);

  const renderRuleSpecificInput = () => {
    if (rule?.type === "integer" || rule?.type === "float") {
      return (
        <div className="flex gap-2">
          <CustomText
            stylearr={[12, 16, 500]}
            className="text-[#37474F] whitespace-nowrap"
          >
            Step Size
          </CustomText>
          <CustomInput
            type="number"
            className="border-t-[0px] border-x-[0px] rounded-none border-b-[1px] hover:ring-0 focus:ring-0 focus-visible:ring-0 p-0 w-[63px] h-[17px]"
            value={stepSize}
            onChange={handleStepSizeChange}
            step={rule?.type === "integer" ? 1 : 0.1}
          />
          <TbCaretUpDownFilled className="text-[#C5C5C7]" />
        </div>
      );
    } else if (rule?.type === "enum" || rule?.type === "string") {
      return (
        <CustomText
          stylearr={[12, 16, 500]}
          onClick={() =>
            EventBus.getInstance().fireEvent(EVENT_OPEN_OPTION_MODAL, rule?.id)
          }
          color={"#3762DD"}
          className="cursor-pointer"
        >
          + Add Option
        </CustomText>
      );
    }
    return null;
  };

  return (
    <div
      className={`flex-col w-full h-full gap-2 border rounded-[12px] p-4 flex flex-col gap-4 justify-center py-[30px] ${
        isInErrorState ? "bg-[#ffd8d44d] border-[#FFD8D4]" : ""
      }`}
    >
      <div className="w-full justify-between flex flex-col h-full">
        <div className="w-full justify-between items-center flex">
          <CustomText stylearr={[14, 19, 700]}>{rule.title}</CustomText>
          <div className="flex gap-[40px]">
            {renderRuleSpecificInput()}
            <div className="text-[#37474F]">
              <CustomText stylearr={[12, 16, 500]}>
                Possible Values: {possibleValuesCount}
              </CustomText>
            </div>
          </div>
        </div>
        <div>
          {rule?.type === "integer" || rule?.type === "float" ? (
            <div className="w-full justify-between flex gap-[40px]">
              <div className="flex flex-col gap-4 flex-1">
                <CustomText stylearr={[12, 16, 500]}>Minimum Value</CustomText>
                <div className="w-full flex gap-4 items-center">
                  <CustomInput
                    type="number"
                    className="border-t-[0px] flex-grow border-x-[0px] rounded-none border-b-[1px] hover:ring-0 focus:ring-0 focus-visible:ring-0 p-0 h-[17px]"
                    value={minValue}
                    onChange={handleMinValueChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 flex-1">
                <CustomText stylearr={[12, 16, 500]}>Maximum Value</CustomText>
                <div className="w-full flex gap-4 items-center">
                  <CustomInput
                    type="number"
                    className="border-t-[0px] flex-grow border-x-[0px] rounded-none border-b-[1px] hover:ring-0 focus:ring-0 focus-visible:ring-0 p-0 h-[17px]"
                    value={maxValue}
                    onChange={handleMaxValueChange}
                  />
                </div>
              </div>
            </div>
          ) : rule?.type === "enum" || rule?.type === "string" ? (
            rule?.values ? (
              <div className="flex flex-col gap-4">
                <CustomText stylearr={[12, 16, 500]}>Select Options</CustomText>
                <div className="flex flex-wrap gap-4">
                  {rule?.values?.map((option, index) => {
                    return (
                      <div
                        key={`select-${index}`}
                        className="flex gap-2 items-center"
                        onClick={() => handleOptionChange(index)}
                      >
                        <CustomCheckbox
                          borderRadius="2px"
                          color={"#3762DD"}
                          isChecked={selectedOptions[index]}
                        />
                        <CustomText stylearr={[12, 16, 500]}>
                          {option}
                        </CustomText>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-row gap-2 text-[#E64A19]">
                <InfoOutlineIcon />
                <CustomText stylearr={[12, 18, 400]}>
                  Please add possible values using 'Add Option' to proceed
                </CustomText>
              </div>
            )
          ) : rule?.type === "boolean" ? (
            <div className="flex flex-col gap-4">
              <CustomText stylearr={[12, 16, 500]}>Select Options</CustomText>
              <div className="flex flex-wrap gap-4">
                <div
                  key={`select-${true}`}
                  className="flex gap-2 items-center"
                  onClick={() => {
                    const updatedSet = new Set(booleanValues);
                    if (updatedSet?.has(true)) {
                      updatedSet.delete(true);
                    } else {
                      updatedSet.add(true);
                    }
                    setBooleanValues(updatedSet);
                  }}
                >
                  <CustomCheckbox
                    borderRadius="2px"
                    color={"#3762DD"}
                    isChecked={booleanValues?.has(true)}
                  />
                  <CustomText stylearr={[12, 16, 500]}>True</CustomText>
                </div>
                <div
                  key={`select-${false}`}
                  className="flex gap-2 items-center"
                  onClick={() => {
                    const updatedSet = new Set(booleanValues);
                    if (updatedSet?.has(false)) {
                      updatedSet.delete(false);
                    } else {
                      updatedSet.add(false);
                    }
                    setBooleanValues(updatedSet);
                  }}
                >
                  <CustomCheckbox
                    borderRadius="2px"
                    color={"#3762DD"}
                    isChecked={booleanValues?.has(false)}
                  />
                  <CustomText stylearr={[12, 16, 500]}>False</CustomText>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {errorText && (
        <CustomText stylearr={[11, 12, 500]} color={"#E64A19"}>
          {errorText}
        </CustomText>
      )}
    </div>
  );
};

export default RuleConfig;
