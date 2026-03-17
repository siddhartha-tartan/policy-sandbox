import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  StackDivider,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import GradientText from "../../../../common/GradientText/GradientText";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { Policy } from "../../../hooks/useGetPolicies";
import { selectedVersionAtom } from "../atom";

const MotionChevronIcon = motion(ChevronDownIcon);

export const VersionCell = ({ policy }: { policy: Policy }) => {
  const versions = policy?.policy_files || [];
  const [selectedVersions, setSelectedVersions] = useAtom(selectedVersionAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const selectedVersion = selectedVersions?.[policy.id] || versions?.[0]?.id || "";
  const selectedVersionNumber =
    versions?.find((item) => item.id === selectedVersion)?.version || versions?.[0]?.version || "";

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersions((prev) => ({
      ...prev,
      [policy.id]: versionId,
    }));
    onClose();
  };
  return (
    <Popover
      key={`version-${policy.id}`}
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <span onClick={onOpen}>
          <Flex className="flex w-fit gap-2 cursor-pointer border rounded-lg py-2 px-4 bg-[linear-gradient(231deg,rgba(55,98,221,0)_13.46%,rgba(55,98,221,0.2)_194.11%)] border-[#3762DD]">
            <GradientText
              text={`V${selectedVersionNumber}`}
              gradient="linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
              className="text-xs font-semibold font-[Manrope] cursor-pointer"
            />
            <MotionChevronIcon
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </Flex>
        </span>
      </PopoverTrigger>

      <Portal>
        <PopoverContent className="border-none p-0 m-0 w-fit focus-visible:ring-0">
          <VStack
            spacing={2}
            className="rounded-lg w-[63px] gap-1 max-h-[200px] overflow-y-auto shadow-[0px_5px_15px_0px_rgba(0,0,0,0.15)]"
            borderColor="#E5E6E6"
            divider={<StackDivider />}
          >
            {versions?.map((version, id) => (
              <Flex
                key={`version-${id}`}
                className="w-full rounded-lg p-3 justify-center cursor-pointer hover:bg-[linear-gradient(231deg,rgba(55,98,221,0)_13.46%,rgba(55,98,221,0.2)_194.11%)]"
                onClick={() => handleVersionSelect(version.id)}
              >
                <CustomText
                  stylearr={[12, 20, 600]}
                  color={systemColors.grey[900]}
                >
                  {`V${version.version}`}
                </CustomText>
              </Flex>
            ))}
          </VStack>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
