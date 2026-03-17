import { Box, Grid, Text } from "@chakra-ui/react";
import { userStore } from "../../store/userStore";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import { isAbfl } from "../../utils/constants/endpoints";

export default function Watermark({ page = 6 }) {
  const { name, organisationName, sourceEmployeeId } = userStore();

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      opacity={0.5}
      w="full"
      h={"full"}
      overflow="hidden"
      pointerEvents="none"
      // zIndex={-1} // Ensure the watermark stays in the background
    >
      <Grid templateColumns={"repeat(2,1fr)"} rowGap={10} columnGap={10}>
        {Array.from({ length: page * 50 })?.map((row, col) => (
          <Text
            key={`${row}-${col}`}
            fontSize="30px"
            py={10}
            lineHeight="38px"
            transform="rotate(-45deg)"
            transformOrigin="center"
            color={systemColors.red[400]}
            mx={6}
            my={4}
            textAlign="center"
            className="select-none"
          >
            FOR {isAbfl ? "ABCL" : organisationName} USE ONLY
            <br />
            Employee ID: {sourceEmployeeId}
            <br />
            {name}
          </Text>
        ))}
      </Grid>
    </Box>
  );
}
