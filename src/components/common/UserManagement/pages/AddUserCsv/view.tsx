import { useState } from "react";
import useGetUserType from "../../../../../hooks/useGetUserType";
import {
  BASE_MODULE_ROUTE,
  BASE_ROUTES,
  UserType,
} from "../../../../../utils/constants/constants";
import PageLayout from "../../../PageLayout";
import CsvStepper from "./components/CsvStepper";
import Header from "./components/Header";

export interface CsvParsedUser {
  source_employee_id: string;
  name: string;
  email: string;
  phone_number: string;
  user_type: UserType;
  loan_category_id: Set<string>;
  PolyGPT: boolean;
  AI_ASSESSMENT: boolean;
  PolicyComparison: boolean;
  is_active?: boolean;
}

export default function AddUserCsv({ isEdit = false }: { isEdit?: boolean }) {
  const userType = useGetUserType();
  const [userData, setUserData] = useState<CsvParsedUser[]>([]);
  return (
    <PageLayout
      breadCrumbsData={[
        {
          label: "User Management",
          navigateTo: `${BASE_ROUTES[userType]}/${BASE_MODULE_ROUTE.USER}`,
        },
        {
          label: isEdit ? "Modify Employees" : "Add Employees",
          navigateTo: ``,
        },
      ]}
    >
      <div className="flex flex-col p-6 pb-2 gap-6 bg-white border border-[#FFF] rounded-[16px] w-full h-full h-full overflow-y-auto">
        <Header users={userData} isEdit={isEdit} />
        <CsvStepper
          userData={userData}
          isEdit={isEdit}
          setUserData={setUserData}
        />
      </div>
    </PageLayout>
  );
}
