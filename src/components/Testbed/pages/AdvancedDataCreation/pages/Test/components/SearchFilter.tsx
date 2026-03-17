import {
  Divider,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import React, { useEffect, useState, useMemo } from "react";
import { Filter, Search } from "react-huge-icons/outline";
import CustomCheckbox from "../../../../../../CustomCheckbox";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import { testDataAtom } from "../../../advancedDataCreationAtom";

interface SearchFilterProps {
  setData: (data: any[]) => void;
  search: string;
  setSearch: Function;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  setData,
  search,
  setSearch,
}) => {
  const testData = useAtomValue(testDataAtom);
  const [expectedOutput, setExpectedOutput] = useState<string[]>([]);

  const config = useMemo(
    () => [
      { title: "Positive Testcases", value: "pass" },
      { title: "Negative Testcases", value: "fail" },
    ],
    []
  );

  const handleFilterClick = (value: string) => {
    setExpectedOutput((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const filterData = useMemo(() => {
    if (!testData) return [];

    let filteredData = [...testData];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchLower);
          }
          if (value != null) {
            return String(value).toLowerCase().includes(searchLower);
          }
          return false;
        })
      );
    }

    if (expectedOutput.length > 0) {
      filteredData = filteredData.filter(
        (item) =>
          item.expected_output != null &&
          expectedOutput.includes(String(item.expected_output))
      );
    }

    return filteredData;
  }, [testData, search, expectedOutput]);

  useEffect(() => {
    setData(filterData);
  }, [filterData, testData]);

  return (
    <div className="flex flex-row gap-4">
      <Menu placement="bottom-end" closeOnSelect={false}>
        <MenuButton
          _hover={{
            background: "#F5F9FF",
            transition: "all 250ms ease-out",
          }}
          background={expectedOutput.length > 0 ? "#F5F9FF" : "#FFF"}
        >
          <Flex className="w-[42px] h-[44px] border rounded-[6px] items-center justify-center flex-row gap-1 cursor-pointer">
            <Filter />
          </Flex>
        </MenuButton>

        <MenuList className="rounded-[11px] w-fit border max-h-[200px] overflow-y-auto">
          {config?.map((item, index) => (
            <React.Fragment key={item.title}>
              <MenuItem
                onClick={() => handleFilterClick(item.value)}
                className="pt-[10px] group pr-[12px] pb-[12px] pl-[10px] hover:bg-[#F8F9FA] flex justify-between transition-all items-center w-full gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-3 text-[12px] font-[500] leading-[16px]">
                  <CustomCheckbox
                    color="#176FC1"
                    fontSize="10px"
                    fontWeight="400"
                    isChecked={expectedOutput.includes(item.value)}
                    borderRadius="4px"
                  />
                  <CustomText
                    noOfLines={1}
                    stylearr={[12, 12, 500]}
                    className="capitalize"
                  >
                    {item.title}
                  </CustomText>
                </div>
              </MenuItem>
              {index !== config.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </MenuList>
      </Menu>

      <div className="py-2 px-5 flex flex-row gap-[10px] text-sm items-center rounded-[6px] border w-[400px]">
        <Search className="text-lg" />
        <Input
          variant="unstyled"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm"
          flexGrow={1}
          placeholder="Search..."
          _placeholder={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 400,
          }}
        />
      </div>
    </div>
  );
};

export default SearchFilter;
