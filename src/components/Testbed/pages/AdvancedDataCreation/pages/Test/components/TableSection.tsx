import { Box, Flex, Icon, Switch } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { BsDownload, BsTrash } from "react-icons/bs";
import CustomTable from "../../../../../../common/CustomTable";
import CustomCheckbox from "../../../../../../CustomCheckbox";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import {
  selectedTestDataAtom,
  testDataAtom,
} from "../../../advancedDataCreationAtom";
import { TestData, TestDataResponse } from "../../../hooks/useGenerateTest";
import SearchFilter from "./SearchFilter";
import Pagination from "../../../../../../common/Pagination";
import CommonDropdownComponent from "../../../../../../common/CommonDropdownComponent";

export default function TableSection() {
  const testData = useAtomValue(testDataAtom);
  const setTestData = useSetAtom(testDataAtom);
  const setSelectedTestData = useSetAtom(selectedTestDataAtom);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [unSelectedRows, setUnSelectedRows] = useState<Set<string>>(new Set());
  const [filteredData, setFilteredData] = useState<TestDataResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState<string>("");

  const columnHelper = createColumnHelper<
    TestData & { sno: number; expected_output: string | null }
  >();

  useEffect(() => {
    setFilteredData(testData);
  }, [testData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, search]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  const columns = useMemo(() => {
    if (!testData || testData.length === 0) return [];

    const baseColumns = [
      {
        id: "selection",
        size: 50,
        header: ({ table }: any) => (
          <CustomCheckbox
            color="#3762DD"
            isChecked={table.getIsAllRowsSelected()}
            setIsChecked={(e) => {
              table.getToggleAllRowsSelectedHandler()(e);
              if (e) {
                setSelectedTestData(testData);
              } else {
                setSelectedTestData([]);
              }
            }}
          />
        ),
      },
      columnHelper.accessor("sno", {
        header: "#",
        cell: (info) => (
          <CustomText stylearr={[14, 20, 500]}>{info.getValue()}</CustomText>
        ),
        size: 80,
      }),
    ];

    const dataColumns = Object.keys(testData[0])
      ?.map((key) => {
        if (key === "expected_output" || key === "id" || key === "sno")
          return null;
        return columnHelper.accessor(key as any, {
          header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
          cell: (info) => {
            const value = info.getValue();
            return (
              <CustomText stylearr={[14, 20, 500]}>
                {value === null || value === undefined
                  ? "-"
                  : typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)}
              </CustomText>
            );
          },
        });
      })
      .filter(Boolean);

    const expectedOutputColumn = [
      columnHelper.accessor("expected_output", {
        header: "Expected Output",
        cell: ({ row }) => {
          const value = row.getValue("expected_output") || null;

          const handleSwitchChange = () => {
            const newValue = value === "pass" ? "fail" : "pass";
            const updatedTestData = [...testData];
            updatedTestData[row.index] = {
              ...updatedTestData[row.index],
              expected_output: newValue,
            };
            setTestData(updatedTestData);
          };

          return (
            <Flex flexDir={"row"} gridGap={"12px"}>
              <Switch
                size="md"
                colorScheme="green"
                isChecked={value === "pass"}
                onChange={handleSwitchChange}
              />
              <CustomText stylearr={[14, 20, 500]}>
                {value === "pass" ? "Approve" : "Reject"}
              </CustomText>
            </Flex>
          );
        },
        size: 150,
      }),
    ];

    return [...baseColumns, ...dataColumns, ...expectedOutputColumn];
  }, [testData, setTestData, setSelectedTestData]);

  useEffect(() => {
    const updatedSelectedTestData = selectAll
      ? filteredData.filter((_, index) => !unSelectedRows.has(index.toString()))
      : filteredData.filter((_, index) => selectedRows.has(index.toString()));
    setSelectedTestData(updatedSelectedTestData);
  }, [filteredData, selectAll, selectedRows, unSelectedRows]);

  const downloadCSV = (data: TestData[]) => {
    const csvRows = [];
    const csvData = data?.map(({ id, sno, ...rest }) => ({
      ...rest,
    }));
    const headers = Object.keys(csvData[0]);
    csvRows.push(headers.join(","));

    for (const row of csvData) {
      csvRows.push(
        headers
          ?.map((fieldName) =>
            JSON.stringify(row[fieldName], (_, value) =>
              value === null ? "" : value
            )
          )
          .join(",")
      );
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "Test Data.csv");
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="w-full justify-between items-end flex">
        <div className="flex flex-row gap-4 items-center">
          {" "}
          <SearchFilter
            setData={setFilteredData}
            search={search}
            setSearch={setSearch}
          />
          {selectedRows.size > 0 || selectAll ? (
            <motion.div
              className="flex justify-center flex-row gap-1 cursor-pointer items-center text-[#E64A19]"
              whileTap={{ scale: 0.95 }}
              whileHover={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                const updatedTestData = testData.filter(
                  (_, index) => !selectedRows.has(index.toString())
                );
                setTestData(updatedTestData);
                const deletedRows = Array.from(selectedRows)?.map(
                  (rowIndex) => testData?.[parseInt(rowIndex)]
                );
                setSelectedTestData((prev) =>
                  prev.filter((item) => !deletedRows.includes(item))
                );
                if (selectAll) {
                  setTestData([]);
                }
                setSelectAll(false);
                setSelectedRows(new Set());
              }}
              transition={{ duration: 0.5 }}
            >
              <Icon as={BsTrash} w={"15px"} h={"15px"} fontSize={"14px"} />
              <CustomText stylearr={[14, 21, 700]} className="text-red-500">
                Delete Row
              </CustomText>
            </motion.div>
          ) : (
            <motion.div
              className="flex justify-center flex-row cursor-pointer items-center text-[#3762DD]"
              whileTap={{ scale: 0.95 }}
              whileHover={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              onClick={() => {}}
              transition={{ duration: 0.5 }}
            ></motion.div>
          )}
        </div>

        <motion.div
          className="border-[1px] border-[#1870C2] rounded-[8px] flex justify-center px-8 flex-row gap-2 h-[45px] cursor-pointer items-center"
          style={{
            background: `linear-gradient(95.11deg, rgba(55, 98, 221, 0) -1.14%, rgba(29, 53, 119, 0.15) 158.31%)`,
          }}
          whileTap={{ scale: 0.95 }}
          whileHover={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            downloadCSV(testData);
          }}
          transition={{ duration: 0.5 }}
        >
          <Icon as={BsDownload} w={"20px"} h={"20px"} fontSize={"14px"} />
          <CustomText stylearr={[14, 21, 700]} className="text-[#555557]">
            Download CSV
          </CustomText>
        </motion.div>
      </div>

      {!testData || testData.length === 0 ? (
        <Flex justify="center" align="center" h="200px">
          <CustomText stylearr={[16, 24, 500]}>
            No test data available
          </CustomText>
        </Flex>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto flex-grow h-full">
          <div className="overflow-y-auto flex-grow h-full">
            <Box
              overflowX="auto"
              w="100%"
              className="overflow-y-auto border-[1px] flex-grow h-full border-[#E4E7EC] rounded-[6px]"
            >
              <CustomTable
                //@ts-ignore
                columns={columns}
                //@ts-ignore
                data={paginatedData}
                selectAll={selectAll}
                setSelectAll={setSelectAll}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                unSelectedRows={unSelectedRows}
                setUnSelectedRows={setUnSelectedRows}
                stickyHeader={true}
                lastColumnSticky={true}
              />
            </Box>
          </div>
          <Flex className="w-full flex justify-between items-center">
            <Pagination
              page={currentPage}
              setPage={(e) => {
                setCurrentPage(e);
              }}
              totalPages={Math.ceil(filteredData?.length / pageSize)}
            />
            <Flex className="gap-4 flex items-center">
              <CommonDropdownComponent
                options={[
                  { label: "Show 10", value: "10" },
                  { label: "Show 20", value: "20" },
                  { label: "Show 30", value: "30" },
                ]}
                value={pageSize?.toString()}
                onChange={(e: string) => {
                  setPageSize(parseInt(e));
                }}
                p={"10px"}
                matchWidth={false}
              />
            </Flex>
          </Flex>
        </div>
      )}
    </>
  );
}
