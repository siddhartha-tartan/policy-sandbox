import { Flex, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import React, { CSSProperties } from "react";
import SortingIcon from "../../assets/Icons/SortingIcon";
import CustomCheckbox from "../CustomCheckbox";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";

interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  lastAlignRight?: boolean;
  setSelectAll?: Function;
  selectAll?: boolean;
  selectedRows?: Set<string>;
  setSelectedRows?: Function;
  unSelectedRows?: Set<string>;
  setUnSelectedRows?: Function;
  highlightedRows?: number[];
  highlightedRowClass?: string;
  expandedRowContent?: React.ReactNode;
  expandRowId?: number;
  stickyHeader?: boolean; // New prop for sticky header
  lastColumnSticky?: boolean;
  headerSizeEnabled?: boolean;
}

export default function CustomTable<TData, TValue>({
  columns,
  data,
  lastAlignRight = true,
  setSelectAll = () => {},
  selectAll = false,
  selectedRows = new Set(),
  setSelectedRows = () => {},
  unSelectedRows = new Set(),
  setUnSelectedRows = () => {},
  highlightedRows = [],
  highlightedRowClass = "shadow-[0px_4px_32px_0px_rgba(23,_111,_193,_0.30)]",
  expandedRowContent = null,
  expandRowId = 0,
  stickyHeader = false,
  lastColumnSticky = false,
  headerSizeEnabled = false,
}: TableProps<TData, TValue>) {
  const tableStyles: React.CSSProperties = headerSizeEnabled
    ? { position: "relative", width: "100%", tableLayout: "fixed" }
    : { position: "relative" };

  // Modify columns to set enableSorting to false by default
  const modifiedColumns = columns.map((column) => ({
    ...column,
    enableSorting: column.enableSorting ?? false,
  }));

  const table = useReactTable({
    columns: modifiedColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    },
    getExpandedRowModel: getExpandedRowModel(),
  });

  const handleSelectAll = (isChecked: boolean) => {
    setSelectAll(isChecked);
    setSelectedRows(new Set<string>());
    setUnSelectedRows(new Set<string>());
  };

  const handleRowSelect = (rowId: string, isChecked: boolean) => {
    if (selectAll) {
      const newRowIds = new Set(unSelectedRows);
      if (!isChecked) {
        newRowIds.add(rowId);
      } else {
        newRowIds.delete(rowId);
      }
      setUnSelectedRows(newRowIds);
    } else {
      const newRowIds = new Set(selectedRows);
      if (isChecked) {
        newRowIds.add(rowId);
      } else {
        newRowIds.delete(rowId);
      }
      setSelectedRows(newRowIds);
    }
  };

  const getBorderRadius = (index: number, total: number) => {
    if (index === 0) return "10px 0 0 10px";
    if (index === total - 1) return "0 10px 10px 0";
    return "unset";
  };

  // Helper to determine if a cell is in the last column
  const isLastColumn = (index: number, totalColumns: number) => {
    return index === totalColumns - 1;
  };

  // Generate sticky column styles with proper TypeScript types
  const getStickyColumnStyle = (
    isLast: boolean,
    isHeader: boolean = false
  ): CSSProperties => {
    if (lastColumnSticky && isLast) {
      return {
        position: "sticky" as const,
        right: 0,
        zIndex: isHeader ? 11 : 1,
        backgroundColor: isHeader ? systemColors.black[50] : "white",
        boxShadow: "-5px 0 5px -5px rgba(0, 0, 0, 0.1)",
      };
    }
    return {};
  };

  return (
    <Flex
      key={data?.length}
      w={"full"}
      flexGrow={1}
      flexDirection="column"
      overflow="auto"
      h={"full"}
    >
      <Table variant="unstyled" style={tableStyles}>
        <Thead
          style={
            stickyHeader
              ? {
                  position: "sticky" as const,
                  top: 0,
                  background: systemColors.black[50],
                  zIndex: 10,
                }
              : {}
          }
        >
          {table.getHeaderGroups().map((headerGroup, index) => (
            <Tr key={index} bg={systemColors.black[50]} h={"56px"}>
              {headerGroup.headers.map((column, id) => {
                const header = headerGroup.headers;
                const isLastIndex = id === header?.length - 1 && lastAlignRight;
                const isLast = isLastColumn(id, headerGroup?.headers?.length);

                let columnStyles: React.CSSProperties = {};

                if (headerSizeEnabled) {
                  const sizeStr = column.getSize()
                    ? `${column.getSize()}%`
                    : "inherit";
                  columnStyles = {
                    width: sizeStr,
                    minWidth: sizeStr,
                    maxWidth: sizeStr,
                    ...getStickyColumnStyle(isLast, true),
                  };
                } else {
                  columnStyles = {
                    width: column.getSize ? column.getSize() : "inherit",
                    ...getStickyColumnStyle(isLast, true),
                  };
                }

                return (
                  <Th
                    key={id}
                    p={"16px"}
                    borderRadius={getBorderRadius(
                      id,
                      headerGroup?.headers?.length
                    )}
                    cursor={"pointer"}
                    onClick={column.column.getToggleSortingHandler()}
                    style={columnStyles}
                  >
                    <Flex
                      flexDir={"row"}
                      justifyContent={"space-between"}
                      height={"100%"}
                      alignItems={"center"}
                    >
                      {column.id === "selection" ? (
                        <CustomCheckbox
                          isChecked={selectAll}
                          setIsChecked={(e) => handleSelectAll(e)}
                          color="#3762DD"
                        />
                      ) : (
                        <CustomText
                          stylearr={[12, 16, 600]}
                          color={"#555557"}
                          textTransform="capitalize"
                          textAlign={isLastIndex ? "right" : "inherit"}
                          w="full"
                          className="whitespace-nowrap"
                        >
                          {column.isPlaceholder
                            ? null
                            : flexRender(
                                column.column.columnDef.header,
                                column.getContext()
                              )}
                        </CustomText>
                      )}
                      {column.column.columnDef.enableSorting && <SortingIcon />}
                    </Flex>
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows?.length
            ? table.getRowModel().rows.map((row, id) => {
                return (
                  <React.Fragment key={id}>
                    <Tr
                      background={
                        id % 2
                          ? systemColors.black[50]
                          : systemColors.white.absolute
                      }
                      borderRadius={"100px"}
                      className={
                        highlightedRows.includes(id) ? highlightedRowClass : ""
                      }
                    >
                      {row.getVisibleCells().map((cell, index) => {
                        const isChecked = () => {
                          if (selectAll) {
                            //@ts-ignore
                            if (unSelectedRows.has(row.original.id))
                              return false;
                            return true;
                          } else {
                            //@ts-ignore
                            if (selectedRows.has(row.original.id)) {
                              return true;
                            }
                            return false;
                          }
                        };

                        const isLast = isLastColumn(
                          index,
                          row.getVisibleCells()?.length
                        );

                        let cellStyles: React.CSSProperties = {};

                        if (headerSizeEnabled) {
                          const sizeStr = cell.column.getSize()
                            ? `${cell.column.getSize()}%`
                            : "inherit";
                          cellStyles = {
                            width: sizeStr,
                            minWidth: sizeStr,
                            maxWidth: sizeStr,
                            ...getStickyColumnStyle(isLast),
                          };
                        } else {
                          cellStyles = {
                            width: cell.column.getSize
                              ? cell.column.getSize()
                              : "inherit",
                            ...getStickyColumnStyle(isLast),
                          };
                        }

                        return (
                          <Td
                            key={`${row.id}-${index}`}
                            p="18px 16px"
                            textAlign={
                              index === row.getVisibleCells()?.length - 1 &&
                              lastAlignRight
                                ? "right"
                                : "left"
                            }
                            style={cellStyles}
                          >
                            {cell.column.id === "selection" ? (
                              <CustomCheckbox
                                isChecked={isChecked()}
                                color="#3762DD"
                                setIsChecked={() => {
                                  handleRowSelect(
                                    //@ts-ignore
                                    row.original.id,
                                    !isChecked()
                                  );
                                }}
                              />
                            ) : (
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )
                            )}
                          </Td>
                        );
                      })}
                    </Tr>
                    <AnimatePresence>
                      {expandedRowContent && expandRowId === id && (
                        <Tr>
                          <Td colSpan={columns?.length}>
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              {expandedRowContent}
                            </motion.div>
                          </Td>
                        </Tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })
            : null}
        </Tbody>
      </Table>
    </Flex>
  );
}
