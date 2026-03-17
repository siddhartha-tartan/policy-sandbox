import { Flex, Input, StackDivider, useDisclosure } from "@chakra-ui/react";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import EventBus from "../../../../../EventBus";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../DesignSystem/CustomButton";
import Pagination from "../../../../common/Pagination";
import useAddDestinationVariable, {
  IAddDestinationVariable,
} from "../hooks/useAddDestinationVariables";
import CsvTabularData from "./CsvTabularData";
import ProcessingModal from "./ProcessingModal";
import { EVENT_OPEN_SUCCESS_IMPORT_DESTINATION_VARIABLE } from "./SuccessModal";

const ReviewCsvData = ({ data }: { data: IAddDestinationVariable[] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate, isLoading } = useAddDestinationVariable();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const itemsPerPage = 12;

  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setPage(1);
        setSearch(value);
      }, 300),
    []
  );

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      return Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search, data]);

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [page, filteredData]);

  const tableOneData = useMemo(() => {
    const midpoint = Math.ceil(paginatedData.length / 2);
    return paginatedData.slice(0, midpoint);
  }, [paginatedData]);

  const tableTwoData = useMemo(() => {
    const midpoint = Math.ceil(paginatedData.length / 2);
    return paginatedData.slice(midpoint);
  }, [paginatedData]);

  useEffect(() => {
    if (isOpen && !isLoading) {
      setTimeout(() => {
        onClose();
      }, 500);
    }
    if (isLoading && !isOpen) {
      onOpen();
    }
  }, [isLoading]);

  return (
    <Flex className="flex-col gap-6 h-full">
      <Flex className="flex-row justify-between items-center">
        <Flex className="py-[10px] px-[14px] border rounded-[6px] w-[400px] mr-6">
          <Input
            variant={"unstyled"}
            fontSize={"14px"}
            onChange={(e) => handleSearch(e.target.value)}
            flexGrow={1}
            placeholder="Search variable"
            _placeholder={{
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 500,
            }}
          />
        </Flex>
        <CustomButton
          className="w-[228px] h-[42px] cursor-pointer"
          style={{
            background:
              "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
            fontSize: "14px",
            fontWeight: 600,
          }}
          onClick={() => {
            mutate(data, {
              onSuccess() {
                EventBus.getInstance().fireEvent(
                  EVENT_OPEN_SUCCESS_IMPORT_DESTINATION_VARIABLE
                );
              },
            });
          }}
        >
          Proceed to Variable Mapping
        </CustomButton>
      </Flex>
      <Flex className="flex-row gap-6">
        <CsvTabularData
          key={`t1_${page}_${tableOneData.length}`}
          data={tableOneData}
          flex={1}
        />
        <StackDivider borderColor={systemColors.black[200]} />
        <CsvTabularData
          key={`t2_${page}_${tableTwoData.length}`}
          data={tableTwoData}
          flex={1}
        />
      </Flex>
      <Flex w={"full"} justifyContent={"center"}>
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </Flex>
      <ProcessingModal isOpen={isOpen} />
    </Flex>
  );
};

export default ReviewCsvData;
