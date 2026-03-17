import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { User } from "react-huge-icons/outline";
import { formatUserType } from "../../../../../../../../utils/helpers/formatUserType";
import CustomCheckbox from "../../../../../../../CustomCheckbox";
import CustomText from "../../../../../../../DesignSystem/Typography/CustomText";
import { IAddWorkFlowUser } from "../../../hooks/useAddWorkFlow";

interface IProps {
  value: IAddWorkFlowUser[];
  onChange: (e: IAddWorkFlowUser[]) => void;
  options: IAddWorkFlowUser[];
}

export default function UserSelectionDropdown({
  value,
  onChange,
  options = [],
}: IProps) {
  const itemsPerPage = 10;
  const [userListing, setUserListing] = useState<IAddWorkFlowUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (options?.length) {
      setUserListing(options);
    }
  }, [options]);

  const paginatedUsers = userListing?.slice(0, currentPage * itemsPerPage);

  const hasMoreUsers = userListing?.length > currentPage * itemsPerPage;

  const selectedUserIds = useMemo(() => {
    return new Set(value?.map((u) => u.user_id));
  }, [value]);

  return (
    <div className="flex flex-col gap-4 w-1/2">
      <Popover trigger="click" matchWidth autoFocus={false} placement="auto">
        <PopoverTrigger>
          <div
            className={`flex flex-row justify-between px-5 py-4 h-[40px] items-center border rounded-[10px] `}
          >
            <CustomText stylearr={[14, 22, 400]}>
              {value?.length ? value.length + " User Selected" : "Select User"}
            </CustomText>
            <ChevronDownIcon />
          </div>
        </PopoverTrigger>
        <PopoverContent className="border-none shadow-none w-full">
          <VStack className="w-full max-h-[300px] overflow-y-auto border-[1px] bg-white shadow-md border-gray.200 rounded-[12px] p-4 gap-3">
            {paginatedUsers?.map((item) => {
              const isSelected = selectedUserIds.has(item.user_id);
              return (
                <button
                  key={item?.user_id}
                  className="flex flex-row justify-start gap-3 border rounded-[8px] py-3 px-4 hover:bg-gray-50 w-full hover:bg-[#176FC110] cursor-pointer transition-all"
                  onClick={(e) => {
                    e.stopPropagation(); // Stop the click from bubbling up
                    const newValue = isSelected
                      ? value.filter((u) => u?.user_id !== item?.user_id)
                      : [
                          ...value,
                          {
                            user_id: item?.user_id,
                            name: item?.name,
                            employee_id: item?.employee_id,
                            role: item?.role,
                          },
                        ];
                    onChange(newValue);
                  }}
                >
                  <CustomCheckbox
                    color="#176FC1"
                    isChecked={isSelected}
                    borderRadius="4px"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-row gap-1 items-center">
                      <Text
                        fontSize="12px"
                        lineHeight={"18px"}
                        fontWeight={400}
                        color={"#37474F"}
                        wordBreak={"break-all"}
                        noOfLines={1}
                        overflow={"hidden"}
                      >
                        {"#" + item?.employee_id + " " + item?.name}
                      </Text>{" "}
                    </div>
                    {item?.role && (
                      <CustomText
                        stylearr={[12, 18, 400]}
                        textAlign={"initial"}
                        color={"#78909C"}
                      >
                        {formatUserType(item?.role!)}
                      </CustomText>
                    )}
                  </div>
                </button>
              );
            })}

            {hasMoreUsers && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="w-full justify-center min-h-[40px] items-center flex text-[14px] font-[500] text-[#176FC1] hover:bg-gray-50 w-full  hover:bg-[#176FC110] cursor-pointer transition-all"
              >
                <p>Load more</p>
              </button>
            )}
          </VStack>
        </PopoverContent>
      </Popover>
      <div className={`grid grid-cols-2 gap-4 grow`}>
        {Array.from(selectedUserIds || []).map((item: string) => {
          const user = value.find((u) => u.user_id === item);
          return (
            <div
              className="flex flex-row justify-between px-4 py-2 gap-[10px] rounded-[10px] h-[61px] bg-[linear-gradient(231deg,_rgba(55,98,221,0)_13.46%,_rgba(55,98,221,0.2)_194.11%)] items-center"
              key={item}
            >
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1 items-center">
                  <User color="#3762DD" />
                  <Text
                    bgGradient="linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
                    bgClip="text"
                    fontSize="14px"
                    lineHeight={"22px"}
                    fontWeight={400}
                    wordBreak={"break-all"}
                    noOfLines={1}
                    overflow={"hidden"}
                  >
                    {"#" + user?.employee_id + " " + user?.name}
                  </Text>{" "}
                </div>
                {user?.role && (
                  <CustomText stylearr={[12, 19, 500]} color={"#555557"}>
                    {formatUserType(user?.role!)}
                  </CustomText>
                )}
              </div>

              <CloseIcon
                className="cursor-pointer text-xs w-[10px] h-[10px]"
                onClick={() => {
                  onChange(value.filter((u) => u.user_id !== item));
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
