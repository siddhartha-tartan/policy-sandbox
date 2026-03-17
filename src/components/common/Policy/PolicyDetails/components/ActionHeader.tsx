import {
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  StackDivider,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import useArchiveAction from "./ArchiveAction";
import { useAtomValue } from "jotai";
import {
  selectAllAtom,
  selectedRowIdsAtom,
  unSelectedRowIdsAtom,
} from "../atom";
import EventBus from "../../../../../EventBus";
import { EVENT_OPEN_ARCHIVE_CONFIRMATION } from "./ArchiveConfirmationModal";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import { getHrPortalColorConfig } from "../../../../../utils/getHrPortalColorConfig";
import { IS_HR_PORTAL } from "../../../../../utils/constants/endpoints";

export default function ActionHeader({
  isDisabled,
}: {
  readonly isDisabled: boolean;
}) {
  const hrPortalColorConfig = getHrPortalColorConfig();
  const {
    isOpen: isPopoverOpen,
    onOpen: onPopoverOpen,
    onClose: onPopoverClose,
  } = useDisclosure();
  const archiveAction = useArchiveAction(null, () => {
    EventBus.getInstance().fireEvent(EVENT_OPEN_ARCHIVE_CONFIRMATION);
    onPopoverClose();
  });
  const actions = [archiveAction];
  const selectedRowIds = useAtomValue(selectedRowIdsAtom);
  const unSelectedRowIds = useAtomValue(unSelectedRowIdsAtom);
  const selectAll = useAtomValue(selectAllAtom);
  const isActive =
    !isDisabled &&
    (selectedRowIds?.size || selectAll || unSelectedRowIds?.size);

  return (
    <Flex gap={"12px"} justifyContent={"flex-end"} alignItems={"center"}>
      <Popover
        placement="right-start"
        key={"archive-all"}
        autoFocus={false}
        closeOnBlur
        isOpen={isPopoverOpen}
        onClose={onPopoverClose}
      >
        <PopoverTrigger>
          <Flex
            style={{
              background: IS_HR_PORTAL
                ? hrPortalColorConfig.primary
                : `linear-gradient(95deg, ${systemColors.indigo[350]} -1.14%, ${systemColors.indigo[600]} 158.31%)`,
            }}
            justifyContent={"center"}
            alignItems={"center"}
            w={"30px"}
            h={"30px"}
            borderRadius={"8px"}
            cursor={isActive ? "pointer" : "not-allowed"}
            opacity={isActive ? 1 : 0.4}
            onClick={(e) => {
              if (!isActive) {
                e.preventDefault();
              } else {
                onPopoverOpen();
              }
            }}
          >
            <BsThreeDotsVertical style={{ fontSize: "16px" }} color="#fff" />
          </Flex>
        </PopoverTrigger>
        <PopoverContent className="w-fit shadow-none border-none p-0 bg-[transparent]">
          <VStack
            divider={<StackDivider style={{ margin: 0 }} />}
            className="w-[213px] max-h-[300px] overflow-y-auto border-[1px] bg-white shadow-md border-gray.200 rounded-[12px] p-2 gap-2"
          >
            {actions?.map((action) => (
              <Flex
                key={action.title}
                onClick={action?.onClick || undefined}
                className="py-[10px] px-3 hover:bg-[#F8F9FA] flex-row gap-3 transition-all items-center w-full cursor-pointer"
              >
                {action.icon}
                <CustomText stylearr={[12, 20, 500]} color={"#37474F"}>
                  {action.title}
                </CustomText>
              </Flex>
            ))}
          </VStack>
        </PopoverContent>
      </Popover>
    </Flex>
  );
}
