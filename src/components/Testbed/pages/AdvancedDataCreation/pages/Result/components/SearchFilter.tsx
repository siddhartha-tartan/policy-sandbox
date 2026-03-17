import { Input } from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import { Search } from "react-huge-icons/outline";

interface SearchFilterProps {
  data: any[];
  setData: Function;
  search: string;
  setSearch: Function;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  data,
  setData,
  search,
  setSearch,
}) => {
  const filterData = useMemo(() => {
    if (!data) return [];

    let filteredData = [...data];

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

    return filteredData;
  }, [data, search]);

  useEffect(() => {
    setData(filterData);
  }, [filterData]);

  return (
    <div className="flex flex-row gap-4">
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
