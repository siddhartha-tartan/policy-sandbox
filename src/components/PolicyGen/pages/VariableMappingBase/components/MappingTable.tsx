import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Trash } from "react-huge-icons/outline";
import Pagination from "../../../../common/Pagination";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { IDestinationVariable } from "../hooks/useGetVariableMapping";
import useUpdateVariableMapping from "../hooks/useUpdateVariableMapping";
import EmptyState from "./EmptyState";
import VariableDropdown from "./VariableDropdown";

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2, // Delay between each row animation
    },
  },
};

const MappingTable = ({
  data,
  destinationVariables,
  setDestinationVariableSearch,
  isMappedTab,
  isEmpty,
}: {
  data: Record<string, IDestinationVariable>;
  destinationVariables: string[];
  setDestinationVariableSearch: (e: string) => void;
  isMappedTab: boolean;
  isEmpty: boolean;
}) => {
  const [editPayload, setEditPayload] =
    useState<Record<string, IDestinationVariable>>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Ref for the scrollable container
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { mutate, isLoading } = useUpdateVariableMapping();

  // Scroll to top when page changes
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  const hasDifferences = useMemo(() => {
    return Object.keys(data).some((key) => {
      const dataValue = data[key];
      const editValue = editPayload[key];

      // Compare properties of IDestinationVariable
      return (
        dataValue?.destination_variable !== editValue?.destination_variable ||
        dataValue?.data_type !== editValue?.data_type ||
        dataValue?.description !== editValue?.description
      );
    });
  }, [editPayload, data]);

  // Pagination logic
  const editPayloadEntries = Object.entries(editPayload);
  const totalPages = Math.ceil(editPayloadEntries.length / itemsPerPage);

  const paginatedData = editPayloadEntries?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isEmpty) {
    return (
      <Flex className="w-full h-full justify-center items-center">
        <EmptyState />
      </Flex>
    );
  }

  return (
    <Box flexGrow={1} overflowY="auto" h={"full"}>
      <Flex className="flex-col h-full overflow-y-auto relative">
        {/* Header */}
        <Flex className="flex-row " background={"#FAFAFA"}>
          <Flex className="flex-1 p-4">
            <CustomText stylearr={[12, 20, 700]} color={"#687588"}>
              Source Variables
            </CustomText>
          </Flex>
          <Flex className="flex-1 justify-between items-center pl-14">
            <CustomText
              stylearr={[12, 20, 700]}
              color={"#687588"}
              className="p-4"
            >
              Destination Variables
            </CustomText>
            <CustomButton
              className="w-[107px] h-[40px] cursor-pointer"
              style={{
                background:
                  "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
                fontSize: "14px",
                fontWeight: 600,
              }}
              isLoading={isLoading}
              isDisabled={
                !Object.entries(editPayload || {})?.length ||
                isLoading ||
                !hasDifferences
              }
              onClick={() => {
                const payload = Object.entries(editPayload).map(
                  ([key, value]) => ({
                    source_variable: key,
                    ...value,
                  })
                );
                mutate(payload);
              }}
            >
              Save
            </CustomButton>
          </Flex>
        </Flex>

        {/* Body */}
        <motion.div
          ref={tableContainerRef}
          className="flex-col flex-grow h-full overflow-y-auto"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {!isMappedTab && (
            <Flex className="flex-row border-b h-[66px] px-4 items-center">
              <Flex className="flex-1 justify-between items-center">
                <CustomText stylearr={[12.5, 20, 500]}>
                  No Source Variable
                </CustomText>

                <ArrowForwardIcon />
              </Flex>
              <Flex className="flex-1 pl-24">
                <VariableDropdown
                  options={destinationVariables}
                  onSelect={() => {}}
                  setSearchQuery={setDestinationVariableSearch}
                />
              </Flex>
            </Flex>
          )}

          {paginatedData?.map(([key, value]) => (
            <Flex className="flex-row border-b h-[66px] px-4 items-center">
              <Flex className="flex-1 justify-between items-center">
                <Flex className="flex-row gap-3 items-center">
                  <Flex className="w-8 h-8 items-center justify-center bg-[#E1F5FE] text-[#0074FF] rounded-[6px]">
                    {value?.data_type?.[0]?.toUpperCase()}
                  </Flex>
                  <Flex className="flex-col">
                    <CustomText stylearr={[12.5, 20, 500]}>{key}</CustomText>
                    <CustomText stylearr={[11, 16, 500]} color={"#666D80"}>
                      {value?.description}
                    </CustomText>
                  </Flex>
                </Flex>

                <ArrowForwardIcon />
              </Flex>
              <Flex className="flex-1 pl-24">
                {value?.destination_variable ? (
                  <Flex className="flex-row gap-2 items-center">
                    <Flex className="w-8 h-8 items-center justify-center bg-[#E1F5FE] text-[#0074FF] rounded-[6px]">
                      {value?.data_type?.[0]?.toUpperCase()}
                    </Flex>

                    <CustomText stylearr={[12.5, 20, 500]}>
                      {value?.destination_variable}
                    </CustomText>
                    <Trash
                      color="#E64A19"
                      cursor={"pointer"}
                      onClick={() =>
                        setEditPayload((prev) => ({
                          ...prev,
                          [key]: {
                            ...value,
                            destination_variable: null,
                          },
                        }))
                      }
                    />
                  </Flex>
                ) : (
                  <VariableDropdown
                    options={destinationVariables}
                    onSelect={(selectedVar: string) =>
                      setEditPayload((prev) => ({
                        ...prev,
                        [key]: {
                          ...value,
                          destination_variable: selectedVar,
                        },
                      }))
                    }
                    setSearchQuery={setDestinationVariableSearch}
                  />
                )}
              </Flex>
            </Flex>
          ))}

          <Flex w={"full"} justifyContent={"center"} mt={4}>
            <Pagination
              page={currentPage}
              setPage={setCurrentPage}
              totalPages={totalPages}
            />
          </Flex>
        </motion.div>
      </Flex>
    </Box>
  );
};

export default MappingTable;
