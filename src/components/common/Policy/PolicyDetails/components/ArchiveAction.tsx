import { Flex } from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import { Archive } from "react-huge-icons/outline";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import { PolicyItem } from "../../hooks/useGetPolicyByCategory";
import { selectedPolicyAtom } from "../atom";

export default function useArchiveAction(
  data: PolicyItem | null,
  onClick: () => void
) {
  const setSelectedPolicy = useSetAtom(selectedPolicyAtom);

  const config = {
    icon: (
      <Flex
        bgColor={systemColors.orange[500]}
        justifyContent="center"
        alignItems="center"
        w="30px"
        h="30px"
        borderRadius="8px"
      >
        <Archive style={{ fontSize: "16px" }} color="#fff" />
      </Flex>
    ),
    title: "Archive",
    onClick: () => {
      setSelectedPolicy(data || null);
      onClick();
    },
  };
  return config;
}
