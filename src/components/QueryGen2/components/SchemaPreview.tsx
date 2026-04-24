import {
  Badge,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FiDatabase, FiTable } from "react-icons/fi";
import CustomText from "../../DesignSystem/Typography/CustomText";
import { getSchemaPreview, TablePreview } from "../utils/schemaPreview";
import { getBaselinePolicyRules } from "../utils/policyEngine";

interface SchemaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbLabel: string;
  onSelect?: () => void;
}

export default function SchemaPreviewModal({
  isOpen,
  onClose,
  dbLabel,
  onSelect,
}: SchemaPreviewModalProps) {
  const tables = useMemo(() => getSchemaPreview(), []);
  const policyRules = useMemo(() => getBaselinePolicyRules(), []);
  const [selectedTable, setSelectedTable] = useState<TablePreview>(tables[0]);
  const [activeView, setActiveView] = useState<"schema" | "policy">("schema");

  const handleSelectAndContinue = () => {
    onSelect?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(3px)" />
      <ModalContent
        m={6}
        borderRadius="xl"
        h="calc(100vh - 48px)"
        maxW="calc(100vw - 48px)"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <ModalCloseButton zIndex={10} top={3} right={3} />

        {/* Header */}
        <Flex
          className="items-center gap-3 px-6 border-b border-[#E4E7EC] flex-shrink-0"
          h="56px"
        >
          <FiDatabase size={18} color="#3762DD" />
          <CustomText stylearr={[16, 22, 600]} color="#111827">
            {dbLabel}
          </CustomText>
          <Badge
            colorScheme="blue"
            variant="subtle"
            borderRadius="full"
            px={2}
            fontSize="11px"
            fontWeight={500}
          >
            {tables.length} tables
          </Badge>
        </Flex>

        <Flex
          className="px-6 border-b border-[#E4E7EC] items-center gap-2 flex-shrink-0"
          h="52px"
          bg="#FAFBFC"
        >
          {[
            { id: "schema", label: "Schema" },
            { id: "policy", label: "Current Policy Rules" },
          ].map((view) => {
            const isActive = activeView === view.id;
            return (
              <Flex
                key={view.id}
                onClick={() =>
                  setActiveView(view.id as "schema" | "policy")
                }
                className="px-3 py-2 rounded-lg cursor-pointer transition-colors"
                bg={isActive ? "#EEF4FF" : "transparent"}
              >
                <CustomText
                  stylearr={[13, 18, isActive ? 600 : 500]}
                  color={isActive ? "#3762DD" : "#6B7280"}
                >
                  {view.label}
                </CustomText>
              </Flex>
            );
          })}
        </Flex>

        <ModalBody p={0} display="flex" flex={1} overflow="hidden">
          {activeView === "schema" ? (
            <>
              {/* Left — Table List */}
              <Flex
                className="flex-col border-r border-[#E4E7EC] flex-shrink-0 overflow-y-auto"
                w="280px"
                bg="#FAFBFC"
                style={{ scrollbarWidth: "thin" }}
              >
                {tables.map((table) => {
                  const isActive = selectedTable?.name === table.name;
                  return (
                    <Flex
                      key={table.name}
                      onClick={() => setSelectedTable(table)}
                      className={`items-center gap-2.5 px-4 py-3 cursor-pointer transition-colors border-l-2 ${
                        isActive
                          ? "bg-white border-l-[#3762DD]"
                          : "border-l-transparent hover:bg-white/60"
                      }`}
                    >
                      <FiTable
                        size={14}
                        color={isActive ? "#3762DD" : "#9CA3AF"}
                      />
                      <Flex className="flex-col flex-1 min-w-0">
                        <CustomText
                          stylearr={[13, 18, isActive ? 600 : 500]}
                          color={isActive ? "#111827" : "#374151"}
                        >
                          {table.name}
                        </CustomText>
                        <CustomText
                          stylearr={[11, 14, 400]}
                          color="#9CA3AF"
                          noOfLines={1}
                        >
                          {table.columns.length} cols ·{" "}
                          {table.rowCount.toLocaleString()} rows
                        </CustomText>
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>

              {/* Right — Data Preview */}
              <Flex className="flex-1 flex-col overflow-hidden">
                {selectedTable && (
                  <>
                    <Flex className="px-6 py-3 border-b border-[#E4E7EC] items-center justify-between flex-shrink-0">
                      <Flex className="flex-col gap-0.5">
                        <CustomText stylearr={[15, 20, 600]} color="#111827">
                          {selectedTable.name}
                        </CustomText>
                        <CustomText stylearr={[12, 16, 400]} color="#6B7280">
                          {selectedTable.description}
                        </CustomText>
                      </Flex>
                      <Flex className="items-center gap-2">
                        <Badge
                          fontSize="11px"
                          variant="subtle"
                          colorScheme="gray"
                          borderRadius="full"
                          px={2}
                        >
                          {selectedTable.columns.length} columns
                        </Badge>
                        <Badge
                          fontSize="11px"
                          variant="subtle"
                          colorScheme="blue"
                          borderRadius="full"
                          px={2}
                        >
                          {selectedTable.rowCount.toLocaleString()} rows
                        </Badge>
                      </Flex>
                    </Flex>

                    <Flex
                      className="px-6 py-3 flex-wrap gap-1.5 border-b border-[#F3F4F6] flex-shrink-0"
                      bg="#FAFBFC"
                    >
                      {selectedTable.columns.map((col) => (
                        <Badge
                          key={col.name}
                          fontSize="11px"
                          variant="outline"
                          borderRadius="md"
                          px={2}
                          py={0.5}
                          fontWeight={500}
                          color="#374151"
                          borderColor="#D1D5DB"
                          textTransform="none"
                        >
                          {col.name}
                        </Badge>
                      ))}
                    </Flex>

                    <Flex className="flex-col flex-1 overflow-hidden">
                      <Flex className="px-6 py-2 flex-shrink-0">
                        <CustomText stylearr={[12, 16, 500]} color="#6B7280">
                          Sample Data (3 rows)
                        </CustomText>
                      </Flex>
                      <Flex
                        className="flex-1 px-6 overflow-auto"
                        style={{ scrollbarWidth: "thin" }}
                        alignItems="flex-start"
                      >
                        <Table
                          variant="simple"
                          size="sm"
                          style={{ minWidth: "max-content" }}
                        >
                          <Thead position="sticky" top={0} zIndex={1}>
                            <Tr>
                              {selectedTable.columns.map((col) => (
                                <Th
                                  key={col.name}
                                  py={2.5}
                                  px={4}
                                  bg="#F9FAFB"
                                  borderBottom="1px solid"
                                  borderColor="#E4E7EC"
                                  whiteSpace="nowrap"
                                >
                                  <CustomText
                                    stylearr={[11, 14, 600]}
                                    color="#6B7280"
                                    textTransform="none"
                                  >
                                    {col.name}
                                  </CustomText>
                                </Th>
                              ))}
                            </Tr>
                          </Thead>
                          <Tbody>
                            {[0, 1, 2].map((rowIdx) => (
                              <Tr key={rowIdx} _hover={{ bg: "#F9FAFB" }}>
                                {selectedTable.columns.map((col) => (
                                  <Td
                                    key={`${rowIdx}-${col.name}`}
                                    py={2}
                                    px={4}
                                    borderBottom="1px solid"
                                    borderColor="#F3F4F6"
                                    whiteSpace="nowrap"
                                  >
                                    <CustomText
                                      stylearr={[12, 16, 400]}
                                      color="#111827"
                                    >
                                      {col.sampleValues[rowIdx] ?? "—"}
                                    </CustomText>
                                  </Td>
                                ))}
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Flex>
                    </Flex>
                  </>
                )}
              </Flex>
            </>
          ) : (
            <Flex className="flex-1 flex-col overflow-auto px-6 py-6 gap-5">
              <Flex className="flex-col gap-1">
                <CustomText stylearr={[18, 24, 600]} color="#111827">
                  Current Policy Rules
                </CustomText>
                <CustomText stylearr={[13, 18, 400]} color="#6B7280">
                  These are the baseline underwriting thresholds currently used
                  for policy simulation in QueryGen.
                </CustomText>
              </Flex>

              <Box
                border="1px solid"
                borderColor="#E4E7EC"
                borderRadius="xl"
                overflow="hidden"
              >
                <Table variant="simple" size="sm">
                  <Thead bg="#F9FAFB">
                    <Tr>
                      <Th py={3} px={4}>
                        <CustomText
                          stylearr={[11, 14, 600]}
                          color="#6B7280"
                          textTransform="none"
                        >
                          Rule
                        </CustomText>
                      </Th>
                      <Th py={3} px={4}>
                        <CustomText
                          stylearr={[11, 14, 600]}
                          color="#6B7280"
                          textTransform="none"
                        >
                          Current Threshold
                        </CustomText>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {policyRules.map((rule) => (
                      <Tr key={rule.label} _hover={{ bg: "#F9FAFB" }}>
                        <Td py={3} px={4} borderColor="#F3F4F6">
                          <CustomText stylearr={[13, 18, 500]} color="#111827">
                            {rule.label}
                          </CustomText>
                        </Td>
                        <Td py={3} px={4} borderColor="#F3F4F6">
                          <Badge
                            fontSize="11px"
                            variant="subtle"
                            colorScheme="blue"
                            borderRadius="full"
                            px={2.5}
                            py={1}
                          >
                            {rule.value}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Flex>
          )}
        </ModalBody>

        {/* Footer */}
        {onSelect && (
          <Flex className="px-6 py-3 border-t border-[#E4E7EC] justify-end flex-shrink-0">
            <Button
              size="sm"
              colorScheme="blue"
              bg="#3762DD"
              _hover={{ bg: "#2B50B8" }}
              borderRadius="lg"
              px={6}
              onClick={handleSelectAndContinue}
            >
              Select & Continue
            </Button>
          </Flex>
        )}
      </ModalContent>
    </Modal>
  );
}
