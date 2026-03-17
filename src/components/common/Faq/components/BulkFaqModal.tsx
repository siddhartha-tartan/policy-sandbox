import {
  chakra,
  Flex,
  HStack,
  Image,
  StackDivider,
  useDisclosure,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import DocumentUploadImg from "../../../../assets/Images/document_upload.png";
import EventBus from "../../../../EventBus";
import { ILoanCategory } from "../../../../hooks/useGetLoanCategories";
import { userStore } from "../../../../store/userStore";
import CustomButton from "../../../DesignSystem/CustomButton";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import CustomModal from "../../CustomModal";
import { parseCSV, validateHeaders } from "../../FileSelector";
import { bulkFileFaqAtom, categoryIdAtom } from "../faqAtom";
import useAddFaq from "../hooks/useAddFaq";
import { IResponseFaq } from "../hooks/useGetFaqs";
import ImportingFaqModal from "./ImportingFaqModal";
import PreviewFaq from "./PreviewFaq";
import SelectProductCategoryDropdown from "./SelectProductCategoryDropdown";

export const EVENT_OPEN_BULK_FAQ_MODAL = "EVENT_OPEN_BULK_FAQ_MODAL";
export default function BulkFaqModal() {
  const ref = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useAtom(bulkFileFaqAtom);
  const [error, setError] = useState<string>("");
  const [step, setStep] = useState(0);
  const [categoryId, setCategoryId] = useAtom(categoryIdAtom);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { loanCategories } = userStore();
  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_BULK_FAQ_MODAL, onOpen);
    return () => EventBus.getInstance().removeListener(onOpen);
  }, []);
  const getLabel =
    loanCategories?.filter((row) => row.id === categoryId)?.[0]
      ?.category_type || "";

  const { mutate } = useAddFaq();

  useEffect(() => {
    setFile(null);
    setStep(0);
    setCategoryId("");
  }, [isOpen]);

  const handleDownloadClick = () => {
    const link = document.createElement("a");
    link.href = "/bulk_faq.csv";
    link.download = `sample_bulk_faq.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const acceptedFileTypes = ".csv";
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (
      !acceptedFileTypes
        .split(",")
        .some((type) => selectedFile.name.endsWith(type.trim()))
    ) {
      const errorMessage = `Invalid file type. Only ${acceptedFileTypes} files are allowed.`;
      setError(errorMessage);
      return;
    }

    // Validate file size
    const maxSizeInBytes = 20 * 1024 * 1024;
    if (selectedFile.size > maxSizeInBytes) {
      const errorMessage = `File size exceeds the ${20}MB limit.`;
      setError(errorMessage);
      setFile(null);
      return;
    }

    // Read and validate file content
    try {
      const text = await selectedFile.text();
      const rows = parseCSV(text);

      // Cap the number of entries to 50
      if (rows.length > 50) {
        const errorMessage = `The file contains more than 50 entries. Please upload a file with a maximum of 50 entries.`;
        setError(errorMessage);
        setFile(null);
        return;
      }

      // Validate headers
      const headers = Object.keys(rows[0] || {});
      const headerError = validateHeaders(headers, [
        "FAQ Question",
        "FAQ Description",
      ]);
      if (headerError) {
        setError(headerError);
        setFile(null);
        return;
      }

      for (const row of rows) {
        let rowError = "";
        if (row["FAQ Question"].trim() === "") {
          rowError = "The 'FAQ Question' field is mandatory.";
        }
        if (row["FAQ Description"].trim() === "") {
          rowError = "The 'FAQ Description' field is mandatory.";
        }
        if (rowError) {
          setError(rowError);
          setFile(null);
          return;
        }
      }

      setError("");
      setFile(selectedFile);
    } catch (err) {
      const errorMessage = "Error reading the file. Please try again.";
      setError(errorMessage);
      setFile(null);
    }
  };

  const onSave = (e: IResponseFaq[]) => {
    mutate(e, {
      onSuccess() {
        onClose();
      },
    });
    setStep(2);
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      {step === 1 ? (
        <PreviewFaq onSave={onSave} />
      ) : step === 2 ? (
        <ImportingFaqModal />
      ) : (
        <Flex
          w={"846px"}
          gap={"16px"}
          flexDir={"column"}
          p={"24px"}
          borderRadius={"16px"}
        >
          <CustomText stylearr={[24, 38, 700]} color={"#000"}>
            Bulk Upload FAQs
          </CustomText>
          <Flex className="flex-col gap-[14px] flex">
            <CustomText stylearr={[20, 32, 500]} color={"#111827"}>
              Select Product Category<chakra.span color={"red"}>*</chakra.span>
            </CustomText>
            <SelectProductCategoryDropdown
              textAlign={"left"}
              w={"full"}
              justifyContent={"start"}
              h={"60px"}
              getLabel={getLabel}
              onClick={(item: ILoanCategory) => {
                setCategoryId(item?.id);
              }}
            />
          </Flex>
          <Flex className="flex flex-col gap-0">
            <CustomText stylearr={[20, 32, 500]} color={"#111827"}>
              Upload CSV File<chakra.span color={"red"}>*</chakra.span>
            </CustomText>
            <Flex className="pt-6 w-full flex-col">
              <HStack
                divider={<StackDivider borderColor={"#ECEFF1"} />}
                className="w-full p-6 border-dashed border-[1px] rounded-[8px] border-[#D0D5DD] h-[228px] gap-[44px] justify-center"
              >
                <Flex
                  className="gap-4 cursor-pointer"
                  onClick={() => {
                    try {
                      //@ts-ignore
                      ref.current.value = "";
                    } catch (e) {
                      console.error('issue: fileRef.current.value = "": ', e);
                    }
                    ref?.current?.click();
                  }}
                >
                  <Image src={DocumentUploadImg} h={"70px"} />
                  <Flex className="flex flex-col gap-[14px]">
                    <CustomText stylearr={[16, 19, 600]} color={"#344054"}>
                      {file?.name || "Browse File"}
                    </CustomText>
                    <CustomText stylearr={[14, 18, 500]} color={"#667085"}>
                      {file
                        ? `${(file?.size / 1024 / 1024).toFixed(1)}mb`
                        : "in csv format (max limit is 20 mb)"}
                    </CustomText>
                  </Flex>
                </Flex>
                <Flex className="gap-4 flex flex-col">
                  <CustomText stylearr={[16, 24, 500]}>
                    Sample CSV file
                  </CustomText>
                  <CustomText
                    stylearr={[16, 24, 700]}
                    onClick={handleDownloadClick}
                    className="underline underline-offset-2 border-[#1A237E] cursor-pointer"
                  >
                    Download file
                  </CustomText>
                </Flex>
              </HStack>
              {error && (
                <CustomText color={"#E64A19"} stylearr={[14, 20, 500]}>
                  {error}
                </CustomText>
              )}
            </Flex>
          </Flex>
          <CustomText stylearr={[14, 24, 600]} color={"#000"}>
            <chakra.span color={"red"}>*</chakra.span>
            Note:{" "}
            <chakra.span color={"#101828"} fontWeight={400}>
              First row in your csv file will be taken as row headings and below
              ones will be taken as its data.
            </chakra.span>
          </CustomText>
          <CustomButton
            isDisabled={!(file && categoryId)}
            className="w-fit self-end"
            onClick={() => setStep(1)}
          >
            Upload
          </CustomButton>
        </Flex>
      )}
      <input
        type="file"
        ref={ref}
        accept={".csv"}
        onChange={handleFileChange}
        className="hidden"
      />
    </CustomModal>
  );
}
