import {
  Divider,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Filter } from "react-huge-icons/outline";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { dataTypes } from "../utils/constant";

const SearchFilter = ({
  mappingSearch,
  mappingFilter,
  setMappingFilter,
  setMappingSearch,
}: {
  mappingSearch: string;
  mappingFilter: string;
  setMappingFilter: (e: string) => void;
  setMappingSearch: (e: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null); // Ref for the menu

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle selection/deselection of items
  const handleSelection = (item: string) => {
    setMappingFilter(item);
  };
  return (
    <Flex className="flex-row h-[42px]">
      <Flex className="py-[10px] px-[14px] border rounded-[6px] w-[400px] mr-6">
        <Input
          variant={"unstyled"}
          fontSize={"14px"}
          value={mappingSearch}
          onChange={(e) => {
            const val: string = e.target.value || "";
            setMappingSearch(val);
          }}
          flexGrow={1}
          placeholder="Search variable"
          _placeholder={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 500,
          }}
        />
      </Flex>
      <Flex
        className="w-[107px] border rounded-l-[6px] items-center justify-center text-sm leading-6 font-semibold cursor-pointer"
        _hover={{
          background: "#F5F9FF",
          transition: "all 250ms ease-out",
        }}
        onClick={() => setMappingFilter("")}
        background={mappingFilter ? "#FFF" : "#F5F9FF"}
      >
        All
      </Flex>
      <Menu placement="bottom" isOpen={isOpen}>
        <MenuButton
          onClick={() => setIsOpen((prev) => !prev)}
          _hover={{
            background: "#F5F9FF",
            transition: "all 250ms ease-out",
          }}
          background={mappingFilter ? "#F5F9FF" : "#FFF"}
        >
          <Flex className="w-[107px] h-[42px] border rounded-r-[6px] items-center justify-center flex-row gap-1 cursor-pointer">
            <Filter />
            <Text className="leading-6 font-semibold">Filters</Text>
          </Flex>
        </MenuButton>

        <MenuList
          ref={menuRef}
          className="p-2 rounded-[11px] border max-h-[200px] overflow-y-auto"
        >
          {dataTypes?.map((item, index) => {
            return (
              <React.Fragment key={item}>
                <MenuItem
                  onClick={() => {
                    handleSelection(item);
                    setIsOpen(false);
                  }}
                  className="flex flex-row gap-3 p-[10px]"
                >
                  <CustomText stylearr={[12.5, 20, 500]} color={"#37474F"}>
                    {item}
                  </CustomText>
                </MenuItem>
                {index < dataTypes.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default SearchFilter;
