import { Flex } from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import { Redo } from "react-huge-icons/outline";
import EventBus from "../../../../../EventBus";
import { ArchivePolicyItem } from "../../hooks/useGetArchivePolicy";
import { restorePolicyAtom } from "../atom";
import { EVENT_OPEN_RESTORE_CONFIRMATION } from "./RestoreConfirmationModal";

const RestoreAction = ({ data }: { data: ArchivePolicyItem }) => {
  const setSelectedPolicy = useSetAtom(restorePolicyAtom);
  const size = "30px";
  return (
    <Flex
      bgColor={"#2F78EE"}
      justifyContent={"center"}
      alignItems={"center"}
      w={size}
      h={size}
      borderRadius={"8px"}
      cursor={"pointer"}
      onClick={() => {
        setSelectedPolicy(data);
        EventBus.getInstance().fireEvent(EVENT_OPEN_RESTORE_CONFIRMATION);
      }}
    >
      <Redo style={{ fontSize: "16px" }} color="#fff" />
    </Flex>
  );
};

export default RestoreAction;
