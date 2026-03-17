import { Box, Flex, Icon } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { BsDownload } from "react-icons/bs";
import EventBus from "../../../../../../../EventBus";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import CustomTable from "../../../../../../common/CustomTable"; // Import CustomTable
import Pagination from "../../../../../../common/Pagination";
import {
  runSimulationDataAtom,
  selectedTestDataAtom,
} from "../../../advancedDataCreationAtom";
import { EVENT_OPEN_RULE_DESCRIPTION } from "./RuleDescriptionModal";
import SearchFilter from "./SearchFilter";
import CommonDropdownComponent from "../../../../../../common/CommonDropdownComponent";

// Cell components for table
const NumberCell = ({ value }: { value: any }) => (
  <CustomText stylearr={[14, 20, 500]}>{value}</CustomText>
);

const TextCell = ({ value }: { value: any }) => (
  <CustomText stylearr={[14, 20, 500]}>
    {value === null || value === undefined
      ? "-"
      : typeof value === "object"
      ? JSON.stringify(value)
      : String(value)}
  </CustomText>
);

const ResultCell = ({ value, color }: { value: string; color: string }) => (
  <CustomText stylearr={[14, 20, 500]} color={color}>
    {value}
  </CustomText>
);

const StatusCell = ({ value, color }: { value: string; color: string }) => (
  <CustomText
    stylearr={[14, 20, 500]}
    color={color}
    bgColor={color === "green.500" ? "green.50" : "red.50"}
    className="px-1 py-2 rounded-md min-w-[125px] text-center"
  >
    {value}
  </CustomText>
);

const FailedRuleCell = ({ rules }: { rules: any[] }) => (
  <div className="flex gap-2 items-center justify-center flex-wrap">
    {rules?.map((row: any) => (
      <CustomText
        key={row.rule_code}
        className="text-[#3762DD] cursor-pointer"
        stylearr={[12, 20, 500]}
        onClick={() => {
          EventBus.getInstance().fireEvent(EVENT_OPEN_RULE_DESCRIPTION, row);
        }}
      >
        Rule {row?.rule_code}
      </CustomText>
    ))}
  </div>
);

const RejectionReasonCell = ({ reasons }: { reasons: string[] }) => (
  <div className="flex gap-2 items-center flex-wrap">
    {reasons?.map((row: string, index: number) => (
      <CustomText
        key={index}
        className="text-[#475467] whitespace-nowrap"
        stylearr={[12, 20, 500]}
      >
        {row}
      </CustomText>
    ))}
  </div>
);

const DownloadButton = ({ onClick }: { onClick: () => void }) => (
  <motion.div
    className="border-[1px] border-[#1870C2] rounded-[8px] flex justify-center px-8 flex-row gap-2 h-[45px] cursor-pointer items-center"
    style={{
      background: `linear-gradient(95.11deg, rgba(55, 98, 221, 0) -1.14%, rgba(29, 53, 119, 0.15) 158.31%)`,
    }}
    whileTap={{ scale: 0.95 }}
    whileHover={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    onClick={onClick}
    transition={{ duration: 0.5 }}
  >
    <Icon as={BsDownload} w={"20px"} h={"20px"} fontSize={"14px"} />
    <CustomText stylearr={[14, 21, 700]} className="text-[#555557]">
      Download CSV
    </CustomText>
  </motion.div>
);

const TableFooter = ({
  currentPage,
  setCurrentPage,
  totalPages,
  pageSize,
  setPageSize,
}: {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  pageSize: number;
  setPageSize: (size: number) => void;
}) => (
  <Flex className="w-full flex justify-between items-center">
    <Pagination
      page={currentPage}
      setPage={setCurrentPage}
      totalPages={totalPages}
    />
    <Flex className="gap-4 flex items-center">
      <CommonDropdownComponent
        options={[
          { label: "Show 10", value: "10" },
          { label: "Show 20", value: "20" },
          { label: "Show 30", value: "30" },
        ]}
        value={pageSize.toString()}
        onChange={(e: string) => {
          setPageSize(parseInt(e));
        }}
        matchWidth={false}
      />
    </Flex>
  </Flex>
);

const createTableData = (selectedTestData: any[], runSimulation: any[]) => {
  const temp: any = [];
  selectedTestData?.forEach((row, index) =>
    temp.push({
      ...row,
      result: runSimulation.filter(
        (col) => col.id == (index + 1).toString()
      )[0],
    })
  );
  return temp;
};

const passFailMapper: Record<string, string> = {
  fail: "Rejected",
  pass: "Approved",
};

const prepareCSVData = (data: any[]) => {
  const csvData = data?.map(
    ({ result, id, sno, expected_output, ...rest }) => ({
      ...rest,
      actual_result: passFailMapper[result?.actual_result?.toLowerCase()] || "",
      expected_output: passFailMapper[expected_output?.toLowerCase()] || "",
    })
  );

  return csvData;
};

const generateCSVFile = (data: any[]) => {
  const csvRows = [];
  const csvData = prepareCSVData(data);

  if (!csvData.length) return;

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
        ?.join(",")
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

const createBaseColumns = (columnHelper: any) => [
  columnHelper.accessor("sno", {
    header: "#",
    cell: (info: any) => <NumberCell value={info.getValue()} />,
    size: 80,
  }),
];

const createDataColumns = (data: any[], columnHelper: any) => {
  return Object.keys(data[0])
    ?.map((key) => {
      if (
        key === "result" ||
        key === "expected_output" ||
        key === "id" ||
        key === "sno"
      )
        return null;

      return columnHelper.accessor(key as any, {
        header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
        cell: (info: any) => <TextCell value={info.getValue()} />,
      });
    })
    .filter(Boolean);
};

const createResultColumns = (columnHelper: any) => [
  columnHelper.accessor("expected_output", {
    header: "Expected Output",
    cell: (info: any) => {
      const data: any = info.row.original;
      const actual_result = data?.expected_output;
      return (
        <ResultCell
          value={actual_result === "pass" ? "Approved" : "Rejected"}
          color={actual_result === "pass" ? "green.500" : "red.500"}
        />
      );
    },
  }),
  columnHelper.accessor("actual_result", {
    header: "Actual Result",
    cell: (info: any) => {
      const data: any = info.row.original;
      const actual_result = data?.result?.actual_result === "pass";
      return (
        <ResultCell
          value={actual_result ? "Approved" : "Rejected"}
          color={actual_result ? "green.500" : "red.500"}
        />
      );
    },
  }),
  columnHelper.accessor("match_status", {
    header: "Match Status",
    cell: (info: any) => {
      const data: any = info.row.original;
      const match_status = data?.result?.match_status == "match";
      return (
        <StatusCell
          value={match_status ? "Match" : "Mismatch"}
          color={match_status ? "green.500" : "red.500"}
        />
      );
    },
  }),
  columnHelper.accessor("failed_rule", {
    header: "Rejection Rule",
    cell: (info: any) => {
      const data: any = info.row.original;
      const failed_rule = data?.result?.rejection_reasons;
      return <FailedRuleCell rules={failed_rule} />;
    },
  }),
  columnHelper.accessor("rejection_reason", {
    header: "Rejection Reason",
    cell: (info: any) => {
      const data: any = info.row.original;
      const failed_rule = data?.result?.rejection_reasons?.map(
        (row: any) => row.rule_description
      );
      return <RejectionReasonCell reasons={failed_rule} />;
    },
  }),
];

export default function TableSection() {
  const runSimulation = useAtomValue(runSimulationDataAtom);
  const selectedTestData = useAtomValue(selectedTestDataAtom);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState<string>("");
  const columnHelper = createColumnHelper();

  const data = useMemo(() => {
    return createTableData(selectedTestData, runSimulation);
  }, [selectedTestData, runSimulation]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, search]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  const downloadCSV = () => {
    generateCSVFile(data);
  };

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    const baseColumns = createBaseColumns(columnHelper);
    const dataColumns = createDataColumns(data, columnHelper);
    const resultColumns = createResultColumns(columnHelper);

    return [...baseColumns, ...dataColumns, ...resultColumns];
  }, [data]);

  if (!runSimulation || runSimulation.length === 0) {
    return (
      <Flex justify="center" align="center" h="200px">
        <CustomText stylearr={[16, 24, 500]}>
          No test results available
        </CustomText>
      </Flex>
    );
  }

  return (
    <>
      <div className="w-full justify-between items-end flex">
        <SearchFilter
          data={data}
          setData={setFilteredData}
          search={search}
          setSearch={setSearch}
        />
        <DownloadButton onClick={downloadCSV} />
      </div>
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
              data={paginatedData}
              lastAlignRight={false}
              stickyHeader={true}
            />
          </Box>
        </div>
        <TableFooter
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={Math.ceil(filteredData?.length / pageSize)}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </div>
    </>
  );
}
