import { Flex, Grid, Icon } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useState } from "react";
import { FileDownloadBent } from "react-huge-icons/outline";
import EventBus from "../../../EventBus";
import { customColors } from "../../DesignSystem/Colors/CustomColors";
import { systemColors } from "../../DesignSystem/Colors/SystemColors";
import CustomText from "../../DesignSystem/Typography/CustomText";
import PageLayout from "../PageLayout";
import { endDateAtom, startDateAtom } from "./atom";
import DownloadReportModal, {
  EVENT_CLOSE_DOWNLOAD_REPORT_MODAL,
  EVENT_OPEN_DOWNLOAD_REPORT_MODAL,
} from "./components/DownloadReportModal";
import { IReport, useGetReports } from "./hooks/useGetReports";
import { useGetCsvReportByDateRange } from "./hooks/useGetCsvReportByDateRange";
import formatDateTime from "./utils/formatDateTime";

const Reports = () => {
  const { data } = useGetReports();
  const [startDate] = useAtom(startDateAtom);
  const [endDate] = useAtom(endDateAtom);
  const [selectedReport, setSelectedReport] = useState<null | IReport>(null);
  const color = customColors.ONYX;
  const { setStartDate, setEndDate, setReportName } =
    useGetCsvReportByDateRange();

  const handleDownload = (row: IReport | null) => {
    const reportt = row || selectedReport;
    setReportName(reportt?.apikey || reportt?.name!);
    if (!reportt?.directDownload) {
      setStartDate(formatDateTime(startDate!));
      setEndDate(formatDateTime(endDate!));
      EventBus.getInstance().fireEvent(EVENT_CLOSE_DOWNLOAD_REPORT_MODAL);
    }
  };

  return (
    <PageLayout breadCrumbsData={[{ label: "Reports", navigateTo: "/" }]}>
      <Flex className="bg-white p-6 rounded-[16px] flex-col gap-6">
        <CustomText stylearr={[22, 26, 700]} color={color}>
          Reports
        </CustomText>
        <Grid w="full" gridTemplateColumns={"repeat(3,1fr)"} gap={"24px"}>
          {data?.map((row, id) => {
            return (
              <Flex
                className="flex-1 p-6 rounded-[12px] border-[1px] flex-col gap-4 justify-between cursor-pointer"
                key={id}
                onClick={() => {
                  setReportName("");
                  setStartDate("");
                  setEndDate("");
                  setSelectedReport(row);
                  if (row?.directDownload) {
                    handleDownload(row);
                  } else {
                    EventBus.getInstance().fireEvent(
                      EVENT_OPEN_DOWNLOAD_REPORT_MODAL
                    );
                  }
                }}
              >
                <CustomText stylearr={[18, 24, 700]} color={color}>
                  {row.name}
                </CustomText>
                {/* <CustomText
                  stylearr={[14, 22, 500]}
                  color={systemColors.black[600]}
                >
                  {row.description}
                </CustomText> */}
                <Flex className="flex-row justify-between items-center">
                  <CustomText
                    className="py-[10px] px-3  rounded-[6px]"
                    stylearr={[12, 20, 600]}
                    color={systemColors.indigo[500]}
                    bg={systemColors.indigo[50]}
                  >
                    {row.fileType.toLocaleUpperCase()}
                  </CustomText>
                  <Icon
                    as={FileDownloadBent}
                    fontSize={"20px"}
                    color={systemColors.teal[400]}
                  />
                </Flex>
              </Flex>
            );
          })}
        </Grid>
      </Flex>
      <DownloadReportModal handleDownload={handleDownload} />
    </PageLayout>
  );
};

export default Reports;
