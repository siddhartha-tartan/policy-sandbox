import { chakra, CloseButton } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import EventBus from "../../../../../../../EventBus";
import CustomInput from "../../../../../../common/CustomInput";
import CustomModal from "../../../../../../common/CustomModal";
import CustomButton from "../../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import useGenerateTest from "../../../hooks/useGenerateTest";

export const EVENT_OPEN_CREATE_TEST_MODAL = "EVENT_OPEN_CREATE_TEST_MODAL";

export default function CreateTestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [testCases, setTestCases] = useState<string>("1");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const openHandler = () => setIsOpen(true);

    EventBus.getInstance().addListener(
      EVENT_OPEN_CREATE_TEST_MODAL,
      openHandler
    );

    return () => {
      EventBus.getInstance().removeListener(openHandler);
    };
  }, []);

  const handleTestCasesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTestCases(value);

    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1) {
      setError("You must create at least 1 test case.");
    } else if (numValue > 1000) {
      setError("You cannot create more than 1000 test cases.");
    } else {
      setError("");
    }
  };
  const { generateTestData, isLoading } = useGenerateTest();

  const handleCreate = () => {
    const numValue = parseInt(testCases);
    if (numValue >= 1 && numValue <= 1000) {
      generateTestData(numValue);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      w={"489px"}
      className="p-4 gap-6 flex flex-col"
      onClose={() => setIsOpen(false)}
    >
      <div className="w-full justify-between items-center flex">
        <CustomText stylearr={[16, 32, 500]}>
          How many test cases would you like to create?
        </CustomText>
        <CloseButton onClick={() => setIsOpen(false)} />
      </div>
      <div className="flex flex-col w-full gap-4">
        <CustomText stylearr={[14, 18, 700]}>
          Number of Test Cases
          <chakra.span className="text-error-800">*</chakra.span>
        </CustomText>
        <CustomInput
          value={testCases}
          onChange={handleTestCasesChange}
          type="number"
          min={1}
          max={1000}
          isInvalid={!!error}
        />
        {error && (
          <CustomText
            stylearr={[12, 15, 500]}
            className="text-[#E64A19] mt-[-8px]"
          >
            {error}
          </CustomText>
        )}
      </div>
      <CustomButton
        style={{
          background: `linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)`,
        }}
        onClick={handleCreate}
        isLoading={isLoading}
        className="w-full"
        isDisabled={!!error}
      >
        Create
      </CustomButton>
    </CustomModal>
  );
}
