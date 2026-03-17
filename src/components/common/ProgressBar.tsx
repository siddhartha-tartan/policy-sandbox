import { Progress } from "@chakra-ui/react";

const ProgressBar = () => {
  return (
    <Progress
      hasStripe
      value={100}
      isAnimated={true}
      h={"6px"}
      w={"100%"}
      borderRadius={"12px"}
      colorScheme="blue"
    />
  );
};

export default ProgressBar;
