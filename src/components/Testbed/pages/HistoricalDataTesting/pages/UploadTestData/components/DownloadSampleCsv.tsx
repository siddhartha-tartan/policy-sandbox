import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { FiUpload } from "react-icons/fi";
import CustomButton from "../../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import { Variable } from "../../../../AdvancedDataCreation/hooks/useGetVariables";
import { stepperAtom } from "../atom";

const DownloadSampleCsv = ({ variables }: { variables: Variable[] }) => {
  const [step, setStep] = useAtom(stepperAtom);

  const downloadCsv = () => {
    if (!Array.isArray(variables) || variables?.length === 0) {
      console.error("Invalid or Empty Variables");
      return;
    }
    const headers = variables?.map((obj) => obj?.name)?.filter(Boolean);

    const csvContent = headers?.join(",") + "\n";

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (step !== 3) {
      setStep(3);
    }
  };

  return (
    <div className="flex flex-col p-4 gap-6 border rounded-[6px]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-3">
          <CustomText stylearr={[12, 16, 600]}>Step 2</CustomText>
          <FiUpload />
          <div className="flex flex-col gap-2">
            <CustomText stylearr={[16, 20, 700]}>
              Download and Fill the CSV with Historical Data
            </CustomText>
            <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
              Fill the CSV file with your desired historical data
            </CustomText>
          </div>
        </div>
        <CustomButton
          variant="quaternary"
          fontSize={"14px"}
          lineHeight={"18px"}
          px={6}
          h={"45px"}
          onClick={downloadCsv}
        >
          Download CSV
        </CustomButton>
      </div>
      <AnimatePresence>
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-row gap-1">
              <CustomText stylearr={[14, 20, 700]}>
                Mandatory fields:
              </CustomText>
              <CustomText stylearr={[14, 22, 400]} color={"#555557"}>
                Expected Output
              </CustomText>
            </div>
            <div
              className="flex flex-col gap-2 p-4 border rounded-[8px]"
              style={{
                background:
                  "linear-gradient(231deg, rgba(55, 98, 221, 0.00) 13.46%, rgba(55, 98, 221, 0.20) 194.11%)",
              }}
            >
              <CustomText stylearr={[14, 20, 700]} color={"#3762DD"}>
                Note:
              </CustomText>
              <div className="flex flex-col">
                <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
                  Please do not edit any headers. Adding or removing columns may
                  cause validation errors. Ensure all mandatory fields are
                  completed for each test case.
                </CustomText>
                <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
                  The CSV structure is designed to match the policy rules and
                  variables to enable accurate testing results. Each row
                  represents a separate test scenario.
                </CustomText>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DownloadSampleCsv;
