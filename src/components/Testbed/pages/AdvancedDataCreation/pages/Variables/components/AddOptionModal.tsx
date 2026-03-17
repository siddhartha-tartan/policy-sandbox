import { CloseButton, Divider, VStack } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useAtom } from "jotai";
import EventBus from "../../../../../../../EventBus";
import CustomInput from "../../../../../../common/CustomInput";
import CustomModal from "../../../../../../common/CustomModal";
import CustomButton from "../../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import useGenerateOptionAI from "../../../hooks/useGenerateOptionAI";
import { uniqueVariablesAtom } from "../../../advancedDataCreationAtom";

export const EVENT_OPEN_OPTION_MODAL = "EVENT_OPEN_OPTION_MODAL";

type OptionItemProps = {
  option: string;
  onRemove: (option: string) => void;
};

const OptionItem = ({ option, onRemove }: OptionItemProps) => (
  <div className="flex w-full justify-between items-center gap-[40px] border-[#E1E1E3] border-b-[1px]">
    <CustomText stylearr={[14, 20, 500]}>{option}</CustomText>
    <CloseButton onClick={() => onRemove(option)} />
  </div>
);

type OptionsSectionProps = {
  options: string[];
  onRemoveOption: (option: string) => void;
};

const OptionsSection = ({ options, onRemoveOption }: OptionsSectionProps) => {
  if (options.length === 0) return null;

  return (
    <div className="gap-2 flex flex-col w-full overflow-y-auto max-h-[200px]">
      <CustomText stylearr={[14, 20, 700]}>Created Options</CustomText>
      <div className="w-full flex flex-col overflow-y-auto gap-2">
        {options.map((option) => (
          <OptionItem key={option} option={option} onRemove={onRemoveOption} />
        ))}
      </div>
    </div>
  );
};

type ManualInputSectionProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  isDisabled: boolean;
};

const ManualInputSection = ({
  value,
  onChange,
  onAdd,
  isDisabled,
}: ManualInputSectionProps) => (
  <div className="gap-4 flex flex-col w-full">
    <CustomText stylearr={[14, 20, 700]}>Add Option Manually</CustomText>
    <div className="flex w-full justify-between items-center gap-[40px]">
      <CustomInput
        placeholder="Type and click Add"
        className="rounded-[8px]"
        value={value}
        onChange={onChange}
      />
      <CustomButton
        style={{
          background: `linear-gradient(230.95deg, rgba(55, 98, 221, 0) 13.46%, rgba(55, 98, 221, 0.2) 194.11%)`,
        }}
        className="border-[1px] border-[#1870C2] text-[#555557] h-[40px] w-[200px] text-[16px] rounded-[8px]"
        isDisabled={isDisabled}
        onClick={onAdd}
      >
        Add
      </CustomButton>
    </div>
  </div>
);

type AIInputSectionProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCreate: () => void;
  isLoading: boolean;
  isDisabled: boolean;
};

const AIInputSection = ({
  value,
  onChange,
  onCreate,
  isLoading,
  isDisabled,
}: AIInputSectionProps) => (
  <div className="gap-4 flex flex-col w-full">
    <CustomText stylearr={[14, 20, 700]}>
      Create options with AI Agent
    </CustomText>
    <div className="flex w-full justify-between items-center gap-[40px]">
      <CustomInput
        type="number"
        className="rounded-[8px]"
        value={value}
        onChange={onChange}
        min="1"
        max="100"
      />
      <CustomButton
        style={{
          background: `linear-gradient(230.95deg, rgba(55, 98, 221, 0) 13.46%, rgba(55, 98, 221, 0.2) 194.11%)`,
        }}
        className="border-[1px] border-[#1870C2] text-[#555557] h-[40px] w-[200px] text-[16px] rounded-[8px]"
        isDisabled={isDisabled}
        onClick={onCreate}
      >
        {isLoading ? "Creating..." : "Create with AI"}
      </CustomButton>
    </div>
  </div>
);

export default function AddOptionModal() {
  const [id, setId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [manualInputValue, setManualInputValue] = useState<string>("");
  const [aiInputValue, setAiInputValue] = useState<string>("1");
  const {
    generateOptions,
    options: aiGeneratedOptions,
    isLoading,
  } = useGenerateOptionAI();
  const [uniqueVariables, setUniqueVariables] = useAtom(uniqueVariablesAtom);

  useEffect(() => {
    const openHandler = (variableId: string) => {
      setIsOpen(true);
      setId(variableId);
    };

    EventBus.getInstance().addListener(EVENT_OPEN_OPTION_MODAL, openHandler);

    return () => {
      EventBus.getInstance().removeListener(openHandler);
    };
  }, []);

  useEffect(() => {
    if (aiGeneratedOptions.length > 0) {
      setOptions((prevOptions) => [...prevOptions, ...aiGeneratedOptions]);
    }
  }, [aiGeneratedOptions]);

  const handleManualInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setManualInputValue(e.target.value);
  };

  const handleAiInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAiInputValue(e.target.value);
  };

  const handleAddOption = () => {
    if (manualInputValue.trim() && !options.includes(manualInputValue.trim())) {
      setOptions((prevOptions) => [...prevOptions, manualInputValue.trim()]);
      setManualInputValue("");
    }
  };

  const handleRemoveOption = (optionToRemove: string) => {
    setOptions(options.filter((option) => option !== optionToRemove));
  };

  const handleCreateWithAI = () => {
    const numberOfOptions = parseInt(aiInputValue);
    if (numberOfOptions > 0 && id) {
      generateOptions(id, numberOfOptions);
    }
  };

  const updateVariableWithOptions = () => {
    return uniqueVariables?.map((variable) => {
      if (variable.id === id) {
        return {
          ...variable,
          values: [...(variable.values || []), ...options],
        };
      }
      return variable;
    });
  };

  const handleAddToList = () => {
    if (options.length > 0 && id) {
      const updatedVariables = updateVariableWithOptions();
      setUniqueVariables(updatedVariables);
      setIsOpen(false);
      setOptions([]);
    }
  };

  const handleClose = () => setIsOpen(false);

  const isManualAddDisabled =
    !manualInputValue.trim() || options.includes(manualInputValue.trim());
  const isAiCreateDisabled =
    !aiInputValue.trim() || parseInt(aiInputValue) < 1 || isLoading;

  return (
    <CustomModal
      isOpen={isOpen}
      w={"489px"}
      className="p-4 gap-[40px] flex flex-col"
      onClose={handleClose}
    >
      <div className="w-full justify-between items-center flex">
        <div>
          <div>
            <CustomText stylearr={[16, 32, 500]}>
              Add Options - Variable Name
            </CustomText>
            <CustomText stylearr={[12, 14, 500]} className="text-[#555557]">
              Define and Include Additional Choices for Variables
            </CustomText>
          </div>
        </div>
        <CloseButton onClick={handleClose} />
      </div>
      <VStack className="gap-4 w-full">
        <ManualInputSection
          value={manualInputValue}
          onChange={handleManualInputChange}
          onAdd={handleAddOption}
          isDisabled={isManualAddDisabled}
        />
        <Divider />
        <AIInputSection
          value={aiInputValue}
          onChange={handleAiInputChange}
          onCreate={handleCreateWithAI}
          isLoading={isLoading}
          isDisabled={isAiCreateDisabled}
        />
        <OptionsSection options={options} onRemoveOption={handleRemoveOption} />
      </VStack>
      <CustomButton
        style={{
          background: `linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)`,
        }}
        className="w-full"
        isDisabled={options.length === 0}
        onClick={handleAddToList}
      >
        Add to list
      </CustomButton>
    </CustomModal>
  );
}
