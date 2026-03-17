import { Flex } from "@chakra-ui/react";
import AttemptAssesments from "./components/AttemptAssesments";
import PastAssesments from "./components/PastAssesments";

export default function AllAssesmentsStaff() {
  return (
    <Flex gap={"20px"} flexDir={"column"} w={"full"}>
      <AttemptAssesments />
      <PastAssesments />
    </Flex>
  );
}
