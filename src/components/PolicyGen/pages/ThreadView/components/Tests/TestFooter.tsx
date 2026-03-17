import { Flex } from "@chakra-ui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { LuCode2 } from "react-icons/lu";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import useTestUploadCSV from "../../hooks/useTestUploadCSV";
import {
  csvFileAtom,
  fileErrorAtom,
  stepAtom,
  testResultAtom,
  testStepAtom,
} from "../../threadAtom";

export default function TestFooter() {
  const testStep = useAtomValue(testStepAtom);
  const setStep = useSetAtom(stepAtom);
  const setTestStep = useSetAtom(testStepAtom);
  const csvFile = useAtomValue(csvFileAtom);
  const testInnerStep = useSetAtom(testStepAtom);
  const error = useAtomValue(fileErrorAtom);
  const { mutate, isLoading, data } = useTestUploadCSV();
  const setTestResult = useSetAtom(testResultAtom);
  useEffect(() => {
    if (data?.data) {
      //@ts-ignore
      setTestResult(data?.data);
      testInnerStep(1);
    }
    // if (requestId) {
    //   if (requestId) {
    //     appendQueryParam("test_request_id", requestId);
    //     EventBus.getInstance().fireEvent(EVENT_OPEN_TEST_PROCESSING);
    //   }
    // }
  }, [data]);
  return (
    <Flex className="w-full justify-end gap-6">
      {testStep === 1 && (
        <>
          {/* <CustomButton
            w={"220px"}
            variant="secondary"
            onClick={() =>
              EventBus.getInstance().fireEvent(EVENT_OPEN_SEND_REVIEW_MODAL)
            }
          >
            <Flex className="items-center gap-2">
              <CustomText stylearr={[14, 20, 600]}>
                Send Code for Review
              </CustomText>
              <LuCode2 />
            </Flex>
          </CustomButton> */}
          <CustomButton
            w={"220px"}
            variant="secondary"
            onClick={() => {
              setTestStep(0);
            }}
          >
            <Flex className="items-center gap-2">
              <CustomText stylearr={[14, 20, 600]}>Re-test</CustomText>
              <LuCode2 />
            </Flex>
          </CustomButton>
        </>
      )}
      <CustomButton
        w={"220px"}
        onClick={() => {
          if (testStep === 0) mutate();
          else {
            setStep(0);
          }
        }}
        isDisabled={!(csvFile && !error)}
        isLoading={isLoading}
      >
        <Flex className="items-center gap-2">
          <CustomText stylearr={[14, 20, 600]}>
            {testStep === 0 ? "Proceed" : "Go to Rules"}
          </CustomText>
          <LuCode2 />
        </Flex>
      </CustomButton>
    </Flex>
  );
}
