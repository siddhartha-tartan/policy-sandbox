import {
  Flex,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiDownload,
} from "react-icons/fi";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { chatAtom, selectedChatIndexAtom } from "../../../utils/atom";

const PAGE_SIZE = 20;

interface TableRow {
  [key: string]: unknown;
}

// Pandas DataFrame format: { column: { rowIndex: value } }
interface PandasDataFrame {
  [column: string]: { [rowIndex: string]: unknown };
}

// Check if data is in pandas DataFrame format
const isPandasFormat = (data: unknown): data is PandasDataFrame => {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return false;
  }
  const values = Object.values(data);
  if (values.length === 0) return false;
  // Check if first value is an object with numeric string keys
  const firstValue = values[0];
  if (typeof firstValue !== "object" || firstValue === null) return false;
  const keys = Object.keys(firstValue);
  return keys.length > 0 && keys.every((key) => !isNaN(Number(key)));
};

// Transform pandas format to array of row objects
const transformPandasToRows = (data: PandasDataFrame): TableRow[] => {
  const columns = Object.keys(data);
  if (columns.length === 0) return [];

  // Get all row indices from the first column
  const firstColumn = data[columns[0]];
  const rowIndices = Object.keys(firstColumn).sort(
    (a, b) => Number(a) - Number(b)
  );

  // Build row objects
  return rowIndices.map((rowIndex) => {
    const row: TableRow = {};
    columns.forEach((column) => {
      row[column] = data[column]?.[rowIndex];
    });
    return row;
  });
};

export default function ResultTableTab() {
  const chat = useAtomValue(chatAtom);
  const selectedChatIndex = useAtomValue(selectedChatIndexAtom);
  const [currentPage, setCurrentPage] = useState(1);

  // Get the selected message's result (default to last if no selection)
  const effectiveIndex =
    selectedChatIndex !== null ? selectedChatIndex : chat.length - 1;
  const selectedMessage = chat[effectiveIndex];

  // Reset to page 1 when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMessage?.result]);

  const { tableData, columns } = useMemo(() => {
    if (!selectedMessage?.result) return { tableData: [], columns: [] };
    try {
      const parsed = JSON.parse(selectedMessage.result);

      // Handle pandas DataFrame format: { column: { rowIndex: value } }
      if (isPandasFormat(parsed)) {
        const rows = transformPandasToRows(parsed);
        return {
          tableData: rows,
          columns: Object.keys(parsed),
        };
      }

      // Handle array format
      if (Array.isArray(parsed)) {
        const allKeys = new Set<string>();
        parsed.forEach((row) => {
          if (row && typeof row === "object") {
            Object.keys(row).forEach((key) => allKeys.add(key));
          }
        });
        return {
          tableData: parsed as TableRow[],
          columns: Array.from(allKeys),
        };
      }

      // Handle single object
      return {
        tableData: [parsed] as TableRow[],
        columns: Object.keys(parsed),
      };
    } catch {
      return { tableData: [], columns: [] };
    }
  }, [selectedMessage?.result]);

  const formatCellValue = (value: unknown): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const formatColumnHeader = (key: string): string => {
    return key
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  // Pagination calculations
  const totalPages = Math.ceil(tableData.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, tableData.length);
  const paginatedData = tableData.slice(startIndex, endIndex);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDownloadCSV = useCallback(() => {
    if (columns.length === 0 || tableData.length === 0) return;

    const escapeCsvCell = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const header = columns.map((c) => escapeCsvCell(formatColumnHeader(c))).join(",");
    const rows = tableData.map((row) =>
      columns.map((col) => escapeCsvCell(formatCellValue(row[col]))).join(",")
    );
    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const title = selectedMessage?.title?.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_") || "query_results";
    link.download = `${title}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [columns, tableData, selectedMessage?.title]);

  if (tableData.length === 0) {
    return (
      <Flex className="flex-1 items-center justify-center">
        <CustomText stylearr={[14, 20, 500]} color="#9CA3AF">
          No results available
        </CustomText>
      </Flex>
    );
  }

  return (
    <Flex className="flex-col h-full w-full">
      <Flex className="h-[56px] w-full py-3 px-5 items-center justify-between border-b border-[#E4E7EC] flex-shrink-0">
        <CustomText stylearr={[14, 20, 600]} color="#111827">
          Query Results ({tableData.length} rows)
        </CustomText>
        <Flex className="items-center gap-3">
          <CustomText stylearr={[12, 16, 500]} color="#6B7280">
            Showing {startIndex + 1}-{endIndex} of {tableData.length}
          </CustomText>
          <Tooltip label="Download CSV" placement="top" hasArrow>
            <Flex
              onClick={handleDownloadCSV}
              className="p-[6px] cursor-pointer rounded-md hover:bg-[#F3F4F6] transition-all duration-200 items-center justify-center"
            >
              <FiDownload size={15} color="#6B7280" />
            </Flex>
          </Tooltip>
        </Flex>
      </Flex>
      <Flex
        className="flex-1 w-full"
        overflow="auto"
        style={{ scrollbarWidth: "thin" }}
        alignItems="flex-start"
      >
        <Table
          variant="simple"
          size="sm"
          width="100%"
          style={{ minWidth: "max-content" }}
        >
          <Thead position="sticky" top={0} zIndex={1}>
            <Tr>
              {columns.map((column) => (
                <Th
                  key={column}
                  py={4}
                  px={6}
                  borderBottom="1px solid"
                  borderColor="#E4E7EC"
                  bg="#FAFAFA"
                  whiteSpace="nowrap"
                >
                  <CustomText
                    stylearr={[12, 16, 600]}
                    color="#6B7280"
                    textTransform="none"
                  >
                    {formatColumnHeader(column)}
                  </CustomText>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.map((row, rowIndex) => (
              <Tr
                key={startIndex + rowIndex}
                _hover={{ bg: "#F9FAFB" }}
                transition="background 0.15s ease"
                h="48px"
              >
                {columns.map((column) => (
                  <Td
                    key={`${startIndex + rowIndex}-${column}`}
                    py={3}
                    px={6}
                    borderBottom="1px solid"
                    borderColor="#E4E7EC"
                    whiteSpace="nowrap"
                    h="48px"
                  >
                    <CustomText
                      stylearr={[14, 20, 500]}
                      h={"fit-content"}
                      color="#111827"
                    >
                      {formatCellValue(row[column])}
                    </CustomText>
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Flex>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Flex className="h-[56px] w-full py-3 px-5 items-center justify-between border-t border-[#E4E7EC] flex-shrink-0 bg-white">
          <CustomText stylearr={[12, 16, 500]} color="#6B7280">
            Page {currentPage} of {totalPages}
          </CustomText>
          <Flex className="items-center gap-1">
            <IconButton
              aria-label="First page"
              icon={<FiChevronsLeft size={16} />}
              size="sm"
              variant="ghost"
              isDisabled={currentPage === 1}
              onClick={goToFirstPage}
              _hover={{ bg: "#F3F4F6" }}
            />
            <IconButton
              aria-label="Previous page"
              icon={<FiChevronLeft size={16} />}
              size="sm"
              variant="ghost"
              isDisabled={currentPage === 1}
              onClick={goToPreviousPage}
              _hover={{ bg: "#F3F4F6" }}
            />
            <Flex className="items-center gap-1 px-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Flex
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 items-center justify-center rounded cursor-pointer transition-all ${
                      currentPage === pageNum
                        ? "bg-[#3762DD] text-white"
                        : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <CustomText
                      stylearr={[12, 16, 500]}
                      color={currentPage === pageNum ? "white" : "#6B7280"}
                    >
                      {pageNum}
                    </CustomText>
                  </Flex>
                );
              })}
            </Flex>
            <IconButton
              aria-label="Next page"
              icon={<FiChevronRight size={16} />}
              size="sm"
              variant="ghost"
              isDisabled={currentPage === totalPages}
              onClick={goToNextPage}
              _hover={{ bg: "#F3F4F6" }}
            />
            <IconButton
              aria-label="Last page"
              icon={<FiChevronsRight size={16} />}
              size="sm"
              variant="ghost"
              isDisabled={currentPage === totalPages}
              onClick={goToLastPage}
              _hover={{ bg: "#F3F4F6" }}
            />
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
