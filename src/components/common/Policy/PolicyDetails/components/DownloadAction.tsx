import { Flex } from "@chakra-ui/react";
import { FileDownloadBent } from "react-huge-icons/outline";
import { downloadPreSigned } from "../../../../../utils/useDownloadPreSigned";
import { customColors } from "../../../../DesignSystem/Colors/CustomColors";
import useGetFile from "../../hooks/useGetFile";

type DownloadActionProps = Readonly<{
  categoryId: string;
  policyId: string;
  fileId: string;
  fileName: string;
  onSuccess: () => void;
}>;

export default function useDownloadAction({
  categoryId,
  policyId,
  fileId,
  fileName,
  onSuccess,
}: DownloadActionProps) {
  const { mutate } = useGetFile();

  const handleClick = () => {
    mutate(
      {
        category_id: categoryId,
        policy_id: policyId,
        file_id: fileId,
      },
      {
        onSuccess(successData) {
          downloadPreSigned(successData, fileName);
          onSuccess();
        },
      }
    );
  };

  const config = {
    icon: (
      <Flex
        bgColor={customColors.BLUE_BERRY_400}
        justifyContent="center"
        alignItems="center"
        w="30px"
        h="30px"
        borderRadius="8px"
      >
        <FileDownloadBent style={{ fontSize: "16px" }} color="#fff" />
      </Flex>
    ),
    title: "Download",
    onClick: handleClick,
  };

  return config;
}
