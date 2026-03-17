import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import { useEffect, useState } from "react";
import jsonToCsv from "../../../../utils/common/jsonToCsv";
import { deserializeJson } from "../../../../utils/helpers/deserializeJson";
import CustomToast from "../../CustomToast";

export const getReportByDateRangeKey = "/reports/:reportName";
export const useGetCsvReportByDateRange = () => {
  const [reportName, setReportName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const { customToast } = CustomToast();
  const getReport = async (): Promise<string> => {
    let queryParams: string[] = [];
    if (startDate) queryParams.push(`start_date=${startDate}`);
    if (endDate) queryParams.push(`end_date=${endDate}`);

    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
    const endpoint =
      API_BASE_URL +
      getReportByDateRangeKey.replace(":reportName", reportName) +
      queryString;
    const axios = getProtectedAxios();
    return axios.get(endpoint).then(({ data }) => data?.data);
  };
  const { data, isLoading } = useQuery(
    [getReportByDateRangeKey, startDate, endDate, reportName],
    () => getReport(),
    {
      onError: queryErrorHandler,
      enabled: !!reportName,
      retry: 1,
    }
  );

  useEffect(() => {
    if (data && reportName) {
      let decodedData = "";
      try {
        decodedData = atob(data); // Attempt to decode Base64 string
      } catch (error) {
        customToast("Failed to Fetch Csv", "ERROR");
        return; // Exit early if decoding fails
      }

      const jsonData = deserializeJson(decodedData, "");
      const fileName = `${reportName}${startDate}${endDate}`;
      setReportName("");
      setStartDate("");
      setEndDate("");
      if (jsonData) {
        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          customToast("No Records Found", "ERROR");
          return;
        }
        jsonToCsv(jsonData).then((csv) => {
          // Download File
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);

          // Create a temporary link element
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName; // Fixed file name format

          // Trigger the download
          document.body.appendChild(a); // Append link to the body (needed for Firefox)
          a.click();

          // Cleanup
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      }
    }
  }, [data]);

  return {
    data,
    isLoading,
    setStartDate,
    setEndDate,
    setReportName,
  };
};
