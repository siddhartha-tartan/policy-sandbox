import { Dispatch, SetStateAction, useState } from "react";
import { CsvParsedUser } from "../view";
import ReviewUserTable from "./ReviewUserTable";
import UploadUserCsv from "./UploadUserCsv";

export default function CsvStepper({
  userData,
  setUserData,
  isEdit,
}: {
  userData: CsvParsedUser[];
  setUserData: Dispatch<SetStateAction<CsvParsedUser[]>>;
  isEdit: boolean;
}) {
  const [step, setStep] = useState<number>(1);
  const components = [
    <UploadUserCsv
      setUserData={setUserData}
      setStep={setStep}
      step={step}
      isEdit={isEdit}
    />,
    <ReviewUserTable data={userData} isEdit={isEdit} />,
  ];

  return (
    <div className="flex flex-col gap-6 w-full overflow-y-auto bg-white pr-2">
      {Array.from({ length: step }, (_, i) => components[i])}
    </div>
  );
}
