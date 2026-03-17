import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { LuPlay } from "react-icons/lu";
import { useParams } from "react-router-dom";
import CustomButton from "../../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import { selectedTestDataAtom } from "../../../advancedDataCreationAtom";
import useRunSimulation from "../../../hooks/useRunSimulation";
import { Box, Tooltip } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

export default function Header() {
  const { fileId } = useParams();
  const { mutate, isLoading } = useRunSimulation();
  const selectedTestData = useAtomValue(selectedTestDataAtom);

  const handleSimulation = () => {
    mutate({
      fileId: fileId || "",
      testCases: selectedTestData?.map((row) => ({
        ...row,
        expected_result: row?.expected_output === "pass" ? "pass" : "fail",
      })),
    });
  };

  const buttonStyle = {
    background: `linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)`,
  };

  const SimulationButton = ({
    isDisabled,
    showTooltip = false,
  }: {
    isDisabled: boolean;
    showTooltip?: boolean;
  }) => {
    const button = (
      <CustomButton
        onClick={handleSimulation}
        isLoading={isLoading}
        isDisabled={isDisabled}
        style={buttonStyle}
        w="200px"
        leftIcon={<LuPlay />}
        {...(showTooltip && { rightIcon: <InfoIcon color="gray.400" /> })}
      >
        Run Simulation
      </CustomButton>
    );

    if (showTooltip) {
      return (
        <Tooltip
          label="Please select at least 1 testcase to Run Simulation."
          placement="bottom"
          hasArrow
          bg="white"
          fontWeight={700}
          color="gray.700"
          boxShadow="md"
          borderRadius="md"
          p={2}
        >
          <Box display="inline-block">{button}</Box>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <motion.div
      className="flex flex-col gap-[24px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-col gap-2">
          <CustomText
            stylearr={[20, 26, 700]}
            className="first-letter:capitalize"
          >
            Test Persona Generation
          </CustomText>
          <CustomText
            stylearr={[14, 18, 500]}
            className="first-letter:capitalize"
          >
            Generate and manage test personas
          </CustomText>
        </div>
        <SimulationButton
          isDisabled={selectedTestData?.length === 0}
          showTooltip={selectedTestData?.length === 0}
        />
      </div>
    </motion.div>
  );
}
