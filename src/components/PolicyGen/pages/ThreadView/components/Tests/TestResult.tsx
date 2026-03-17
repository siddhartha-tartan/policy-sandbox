import { Flex } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { testResultAtom } from "../../threadAtom";
import AnimatedSkeleton from "../AnimatedSkeleton";
import ResultProfileNumbers from "./ResultProfileNumbers";
import ResultTable from "./ResultTable";

export default function TestResult() {
  // const { data } = useValidateRule();
  const testResult = useAtomValue(testResultAtom);
  const [profile, setProfile] = useState<{
    errorProfile: number;
    successProfile: number;
  } | null>(null);

  useEffect(() => {
    if (testResult) {
      let error = 0;
      let success = 0;
      testResult?.map((row) => {
        if (row.failure_reason) {
          error = error + 1;
        } else {
          success = success + 1;
        }
        return row;
      });
      setProfile({ errorProfile: error, successProfile: success });
    }
  }, [testResult]);

  return (
    <Flex className="flex flex-col w-full gap-[32px] h-full">
      {testResult && profile ? (
        <>
          <ResultProfileNumbers {...profile} />
          <ResultTable data={testResult} />
        </>
      ) : (
        <Flex className="w-full h-full gap-6 flex-col">
          {Array.from({ length: 5 }, (_, id) => (
            <AnimatedSkeleton
              minH={"40px"}
              h={"60px"}
              key={`animation-${id}`}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
}
