import { Flex, Spinner } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetUserType from "../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../utils/constants/constants";
import { POLICYGEN_SUB_ROUTES } from "../../../common/PolicyGen/utils/constants";
import CustomButton from "../../../DesignSystem/CustomButton";
import { destinationVariablesAtom, variableParsedData } from "./atom";
import Header from "./components/Header";
import ImportDestinationVariableModal from "./components/ImportDestinationVariableModal";
import MappingIndicator from "./components/MappingIndicator";
import MappingTable from "./components/MappingTable";
import ReviewCsvData from "./components/ReviewCsvData";
import SearchFilter from "./components/SearchFilter";
import SuccessModal from "./components/SuccessModal";
import TabButton from "./components/TabButton";
import useGetDestinationVariables from "./hooks/useGetDestinationVariable";
import useGetVariableMapping from "./hooks/useGetVariableMapping";
import { VARIABLE_MAPPING_TABS, variableMappingTab } from "./utils/constant";

const VariableMappingBase = () => {
  // State and Effects
  const currentPath = location.pathname;
  const [csvParsedData, setCsvParsedData] = useAtom(variableParsedData);

  useEffect(() => {
    setCsvParsedData([]);
  }, [currentPath]);

  // URL Parameters and Navigation
  const { policyId, categoryId, fileId } = useParams<{
    policyId: string;
    categoryId: string;
    fileId: string;
  }>();
  const router = useNavigate();

  // Atoms and Custom Hooks
  const destinationVariables = useAtomValue(destinationVariablesAtom);
  const userType = useGetUserType();
  const {
    data,
    isLoading,
    searchQuery: mappingSearch,
    setSearchQuery: setMappingSearch,
    setFilters: setMappingFilter,
    filters: mappingFilter,
  } = useGetVariableMapping();
  const {
    setSearchQuery: setDestinationVariableSearch,
    searchQuery: destinationVariableSearchQuery,
  } = useGetDestinationVariables();

  // Query Parameters
  const currentTab: variableMappingTab =
    (new URLSearchParams(location.search).get("tab") as variableMappingTab) ||
    VARIABLE_MAPPING_TABS.MAPPED;

  const params = new URLSearchParams(location.search);
  const navigationRoute = useMemo(() => {
    const queryParams: Record<string, string> = {};
    params.forEach((value: string, key: string) => {
      if (key !== "tab") queryParams[key] = value;
    });
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return `${
      BASE_ROUTES[userType]
    }/policygen/${POLICYGEN_SUB_ROUTES.POLICY_GEN_DATA.replace(
      ":categoryId",
      categoryId!
    )
      .replace(":policyId", policyId!)
      .replace(":fileId", fileId!)}?${queryString}`;
  }, [location]);

  // Helper Functions
  const appendQueryParam = (key: string, value: string) => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.set(key, value); // Add or update the query param
    router(`?${currentParams.toString()}`, { replace: false });
  };

  const handleTabChange = (tab: variableMappingTab) => {
    appendQueryParam("tab", tab); // Update query params
  };

  useEffect(() => {
    setMappingFilter("");
    setMappingSearch("");
  }, [currentTab]);

  const isMappedTab = currentTab === VARIABLE_MAPPING_TABS.MAPPED;
  const variableMappingData = isMappedTab
    ? data?.mapped_variables
    : data?.unmapped_variables;

  const isEmptyState = () => {
    const hasVariableMappingData = !!Object.entries(variableMappingData || {})
      .length;
    const hasDestinationVariables = !!destinationVariables?.length;

    return isMappedTab
      ? !hasVariableMappingData
      : !destinationVariableSearchQuery &&
          !hasDestinationVariables &&
          !hasVariableMappingData;
  };

  return (
    <AnimatePresence mode="wait">
      <Flex className="px-6 flex-col gap-4 pt-4 h-full w-full overflow-y-auto">
        <Flex className="h-full w-full flex-col gap-4 overflow-y-auto">
          <Flex className="bg-white w-full h-full py-4 flex-grow px-6 rounded-[16px] flex-col gap-6 overflow-y-auto">
            <Header />
            {csvParsedData?.length > 0 ? (
              <ReviewCsvData data={csvParsedData} />
            ) : (
              <Flex className="flex-col h-full w-full gap-4 overflow-y-auto">
                <TabButton
                  handleTabChange={handleTabChange}
                  currentTab={currentTab}
                />
                <MappingIndicator />
                <SearchFilter
                  mappingSearch={mappingSearch}
                  setMappingFilter={setMappingFilter}
                  setMappingSearch={setMappingSearch}
                  mappingFilter={mappingFilter}
                />
                {isLoading ? (
                  <Flex className="justify-center items-center w-full h-full">
                    <Spinner size="lg" />
                  </Flex>
                ) : (
                  <MappingTable
                    key={`${isMappedTab}${
                      Object?.entries(variableMappingData || {})?.length
                    }`}
                    isMappedTab={isMappedTab}
                    data={variableMappingData || {}}
                    destinationVariables={destinationVariables}
                    setDestinationVariableSearch={setDestinationVariableSearch}
                    isEmpty={isEmptyState()}
                  />
                )}
              </Flex>
            )}
          </Flex>
          {fileId && !csvParsedData?.length ? (
            <Flex className="justify-end bg-white w-full h-fit py-2 px-6 rounded-[16px]">
              <CustomButton
                className="h-[40px] w-[136px] text-sm"
                onClick={() => router(navigationRoute)}
              >
                Proceed
              </CustomButton>
            </Flex>
          ) : null}
          <ImportDestinationVariableModal />
          <SuccessModal />
        </Flex>
      </Flex>
    </AnimatePresence>
  );
};

export default VariableMappingBase;
