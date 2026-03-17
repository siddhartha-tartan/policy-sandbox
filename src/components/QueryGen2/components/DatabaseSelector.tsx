import {
  Badge,
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { FiCheck, FiChevronDown, FiDatabase, FiEye } from "react-icons/fi";
import { DbSource } from "../hooks/useGetDbSources";

interface DatabaseSelectorProps {
  dbSources: DbSource[] | undefined;
  isLoading: boolean;
  selectedDbSource: string;
  onSelectDatabase: (value: string) => void;
  onPreviewDatabase?: (dbValue: string) => void;
}

export default function DatabaseSelector({
  dbSources,
  isLoading,
  selectedDbSource,
  onSelectDatabase,
  onPreviewDatabase,
}: DatabaseSelectorProps) {
  const selectedSource = dbSources?.find(
    (source) => source.value === selectedDbSource
  );

  if (isLoading) {
    return (
      <Flex
        className="items-center gap-2 bg-white border border-[#E4E7EC] rounded-lg px-3 py-2 shadow-sm"
        minWidth="220px"
      >
        <FiDatabase color="#6B7280" size={18} />
        <Skeleton height="20px" width="140px" />
      </Flex>
    );
  }

  return (
    <Menu>
      <MenuButton
        as={Flex}
        className="items-center gap-2 bg-white border border-[#E4E7EC] rounded-lg px-3 py-2 shadow-sm cursor-pointer hover:border-[#3762DD] transition-colors"
        minWidth="220px"
      >
        <Flex align="center" gap={2} flex={1}>
          <FiDatabase color="#6B7280" size={18} />
          <Text
            fontWeight={500}
            color="#111827"
            fontSize="sm"
            flex={1}
            textAlign="left"
          >
            {selectedSource?.label || "Select Database"}
          </Text>
          <Icon as={FiChevronDown} color="#6B7280" />
        </Flex>
      </MenuButton>

      <MenuList
        border="1px solid #E4E7EC"
        borderRadius="10px"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.1)"
        maxH="400px"
        overflowY="auto"
        minW="300px"
        py={2}
      >
        {dbSources?.map((source, index) => (
          <Box key={source.value}>
            <Flex
              onClick={() => {
                if (!source.disabled) onSelectDatabase(source.value);
              }}
              bg={selectedDbSource === source.value ? "#F0F5FF" : "transparent"}
              _hover={{ bg: source.disabled ? "transparent" : "#F5F7FA" }}
              py={2.5}
              px={3}
              cursor={source.disabled ? "not-allowed" : "pointer"}
              opacity={source.disabled ? 0.5 : 1}
              align="center"
              gap={2}
            >
              <Icon
                as={FiDatabase}
                color={
                  selectedDbSource === source.value ? "#3762DD" : "#6B7280"
                }
                boxSize={4}
              />
              <Text
                fontWeight={selectedDbSource === source.value ? 600 : 500}
                color={
                  source.disabled
                    ? "#9CA3AF"
                    : selectedDbSource === source.value
                    ? "#3762DD"
                    : "#111827"
                }
                fontSize="sm"
                flex={1}
              >
                {source.label}
              </Text>
              {source.disabled && source.disabledReason && (
                <Badge
                  fontSize="10px"
                  colorScheme="gray"
                  variant="subtle"
                  borderRadius="full"
                  px={2}
                  py={0.5}
                  fontWeight={500}
                  textTransform="none"
                >
                  {source.disabledReason}
                </Badge>
              )}
              {!source.disabled && (
                <Flex
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewDatabase?.(source.value);
                  }}
                  className="items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors"
                  bg="#F3F4F6"
                  _hover={{ bg: "#E5E7EB" }}
                >
                  <FiEye size={12} color="#6B7280" />
                  <Text fontSize="11px" color="#6B7280" fontWeight={500}>
                    Preview
                  </Text>
                </Flex>
              )}
              {!source.disabled && selectedDbSource === source.value && (
                <Icon as={FiCheck} color="#3762DD" boxSize={4} />
              )}
            </Flex>

            {index < dbSources.length - 1 && <MenuDivider my={1} />}
          </Box>
        ))}

        {(!dbSources || dbSources.length === 0) && (
          <Flex py={4} justify="center" align="center">
            <Text fontSize="sm" color="#9CA3AF">
              No databases available
            </Text>
          </Flex>
        )}
      </MenuList>
    </Menu>
  );
}
