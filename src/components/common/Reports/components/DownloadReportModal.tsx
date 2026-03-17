import { useDisclosure } from "@chakra-ui/hooks";
import { CloseButton, Flex } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import EventBus from "../../../../EventBus";
import CustomButton from "../../../DesignSystem/CustomButton";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import CustomModal from "../../CustomModal";
import { dateSelectionAtom, endDateAtom, startDateAtom } from "../atom";
import CustomDateSelection from "./CustomDateSelection";
import CustomDurationSelection from "./CustomDurationSelection";

export const EVENT_OPEN_DOWNLOAD_REPORT_MODAL =
  "EVENT_OPEN_DOWNLOAD_REPORT_MODAL";
export const EVENT_CLOSE_DOWNLOAD_REPORT_MODAL =
  "EVENT_CLOSE_DOWNLOAD_REPORT_MODAL";

export default function DownloadReportModal({
  handleDownload,
}: {
  handleDownload: Function;
}) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [tab, setTab] = useAtom(dateSelectionAtom);
  const [startDate, setStartDate] = useAtom(startDateAtom);
  const [endDate, setEndDate] = useAtom(endDateAtom);

  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_DOWNLOAD_REPORT_MODAL, () => {
      onOpen();
      setStartDate(null);
      setEndDate(null);
      setTab("duration");
    });

    return () => {
      EventBus.getInstance().removeListener(onOpen);
    };
  }, []);

  useEffect(() => {
    EventBus.getInstance().addListener(
      EVENT_CLOSE_DOWNLOAD_REPORT_MODAL,
      () => {
        onClose();
      }
    );

    return () => {
      EventBus.getInstance().removeListener(onClose);
    };
  }, []);

  return (
    <CustomModal borderRadius={"16px"} isOpen={isOpen} onClose={() => {}}>
      <Flex
        className="flex-col gap-6 p-6"
        w={tab === "duration" ? "345px" : "672px"}
      >
        <Flex className="flex-row justify-between">
          <CustomText stylearr={[20, 28, 700]}>Download Report</CustomText>
          <CloseButton onClick={onClose} />
        </Flex>
        {tab === "date" ? <CustomDateSelection /> : <CustomDurationSelection />}
        <CustomButton
          className="w-fit py-3 px-11"
          isDisabled={!startDate || !endDate}
          onClick={() => handleDownload(null)}
        >
          Download
        </CustomButton>
      </Flex>
    </CustomModal>
  );
}
