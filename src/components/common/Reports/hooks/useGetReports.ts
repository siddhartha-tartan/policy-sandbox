import { useQuery } from "react-query";
import useGetUserType from "../../../../hooks/useGetUserType";
import { UserType } from "../../../../utils/constants/constants";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";

export interface IReport {
  id: string;
  name: string;
  description?: string;
  fileType: string;
  apikey?: string;
  directDownload?: boolean;
}

const adminReports: IReport[] = [
  {
    id: "1",
    name: "User Access Management",
    fileType: "CSV",
  },
  {
    id: "2",
    name: "Policy Report",
    fileType: "CSV",
  },
  {
    id: "3",
    name: "Discussion Report",
    fileType: "CSV",
  },
  {
    id: "4",
    name: "User Session Report",
    fileType: "CSV",
  },
  {
    id: "5",
    name: "User Inactivity Report - Last 30 days",
    fileType: "CSV",
    apikey: "Inactive User Report",
    directDownload: true,
  },
  {
    id: "6",
    name: "Billing Report",
    fileType: "CSV",
    apikey: "Billing Report",
    directDownload: true,
  },
];

const spocReports: IReport[] = [
  {
    id: "1",
    name: "User Access Management",
    fileType: "CSV",
  },
  {
    id: "2",
    name: "Assessment Report",
    fileType: "CSV",
  },
  {
    id: "3",
    name: "Discussion Report",
    fileType: "CSV",
  },
];

export const getReportsKey = "/reports";
export const useGetReports = () => {
  const userType = useGetUserType();
  const getReports = async (): Promise<IReport[]> => {
    return userType === UserType.ADMIN ? adminReports : spocReports;
  };
  const { data, isLoading } = useQuery([getReportsKey], () => getReports(), {
    onError: queryErrorHandler,
  });

  return {
    data,
    isLoading,
  };
};
