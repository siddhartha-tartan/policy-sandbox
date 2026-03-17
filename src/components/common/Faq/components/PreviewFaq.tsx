import { Flex, Spinner } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import useGetUserType from "../../../../hooks/useGetUserType";
import CustomButton from "../../../DesignSystem/CustomButton";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import { bulkFileFaqAtom, categoryIdAtom } from "../faqAtom";
import { IResponseFaq } from "../hooks/useGetFaqs";
import { getFaqPermissions } from "../utils/data";
import EditFaq from "./EditFaq";
import ViewFaq from "./ViewFaq";

export default function PreviewFaq({
  onSave,
}: {
  onSave: (e: IResponseFaq[]) => void;
}) {
  const file = useAtomValue(bulkFileFaqAtom);
  const [data, setData] = useState<IResponseFaq[] | null>(null);
  const categoryId = useAtomValue(categoryIdAtom);
  useEffect(() => {
    if (file && !data) {
      const reader = new FileReader();
      reader.onload = () => {
        // Normalize and sanitize the file content to avoid encoding issues
        const sanitizeText = (text: string): string =>
          text.replace(/�/g, "").replace(/\r\n/g, "\n");

        const rawContent = reader.result as string;
        const normalizedContent = sanitizeText(rawContent);

        // Parse the normalized content
        const csvData = Papa.parse(normalizedContent, {
          header: true,
          skipEmptyLines: true,
        });

        const temp: IResponseFaq[] = [];

        csvData?.data?.forEach((row: any, id) => {
          const question = row["FAQ Question"];
          const desc = row["FAQ Description"];

          if (question && desc)
            temp.push({
              query_text: question,
              answer_text: desc,
              category_id: categoryId,
              is_active: true,
              id: id.toString(),
            });
        });

        setData(temp);
      };

      // Read the file with UTF-8 encoding
      reader.readAsText(file, "UTF-8");
    }
  }, [file, data]);
  const userType = useGetUserType();
  const faqPermissions = getFaqPermissions(userType);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleEditFaq = (updatedFaq: IResponseFaq) => {
    if (!data) return;
    const updatedData = data?.map((row) =>
      row.id === updatedFaq.id ? { ...row, ...updatedFaq } : row
    );
    setData(updatedData);
    setEditIndex(null);
  };

  const handleDeleteFaq = (e: { id: string }) => {
    const temp = data?.filter((row) => row.id !== e.id) as IResponseFaq[];
    setData(temp);
    setEditIndex(null);
  };

  return (
    <Flex
      w={"1160px"}
      maxW={"90dvw"}
      gap={"16px"}
      maxH={"90dvh"}
      flexDir={"column"}
      p={"24px"}
      h={"full"}
      overflowY={"auto"}
      borderRadius={"16px"}
    >
      <CustomText stylearr={[24, 38, 700]} color={"#000"}>
        Preview FAQs
      </CustomText>
      {!data ? (
        <Flex className="w-full justify-center items-center h-[300px]">
          <Spinner />
        </Flex>
      ) : (
        <Flex overflowY={"auto"} className="flex-col gap-6">
          {data?.map((item, idx) =>
            editIndex !== null && idx === editIndex ? (
              <EditFaq
                key={`${item.id}-${idx}`}
                data={item}
                onCancel={() => setEditIndex(null)}
                onAdd={() => {}}
                onEdit={handleEditFaq}
              />
            ) : (
              <ViewFaq
                key={`${item.id}-${new Date().getTime().toString()}`}
                index={idx}
                permissions={faqPermissions}
                data={item}
                editIndex={editIndex}
                setEditIndex={setEditIndex}
                onEdit={handleEditFaq}
                onDelete={handleDeleteFaq}
              />
            )
          )}
        </Flex>
      )}
      <CustomButton
        isDisabled={!(file && categoryId)}
        className="w-[144px] self-end"
        minH={"44px"}
        onClick={() => {
          if (data) {
            onSave(data);
          }
        }}
      >
        Proceed
      </CustomButton>
    </Flex>
  );
}
