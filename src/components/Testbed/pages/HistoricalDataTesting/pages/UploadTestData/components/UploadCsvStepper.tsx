import { useAtomValue } from "jotai";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import { Variable } from "../../../../AdvancedDataCreation/hooks/useGetVariables";
import { stepperAtom } from "../atom";
import DownloadSampleCsv from "./DownloadSampleCsv";
import GenerateSampleCsv from "./GenerateSampleCsv";
import UploadCsv from "./UploadCsv";

const UploadCsvStepper = ({ variables }: { variables: Variable[] }) => {
  const step = useAtomValue(stepperAtom);
  const components = [
    <GenerateSampleCsv />,
    <DownloadSampleCsv variables={variables} />,
    <UploadCsv variables={variables} />,
  ];
  return (
    <div className="flex flex-col w-full flex-grow oveflow-y-auto">
      <div className="flex flex-col gap-2 py-4 border-b px-6 h-[79px] min-h-[79px] rounded-t-[12px] bg-white">
        <CustomText stylearr={[16, 20, 700]}>
          Historical Data Validation Hub: Test and Refine Your BRE Rules
        </CustomText>{" "}
        <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
          Improve rule performance by analyzing how they behave with real
          historical data
        </CustomText>{" "}
      </div>
      <div className="flex flex-col gap-6 flex-grow p-4 overflow-y-auto bg-white">
        {Array.from({ length: step }, (_, i) => components[i])}
      </div>
    </div>
  );
};

export default UploadCsvStepper;
