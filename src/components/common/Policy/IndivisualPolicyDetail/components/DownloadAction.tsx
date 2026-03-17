import { Flex, FlexProps } from "@chakra-ui/react";
import { FileDownloadBent } from "react-huge-icons/outline";
import { downloadPreSigned } from "../../../../../utils/useDownloadPreSigned";
import { customColors } from "../../../../DesignSystem/Colors/CustomColors";
import useGetFile from "../../hooks/useGetFile";

interface IProp extends FlexProps {
  categoryId: string;
  policyId: string;
  fileId: string;
  fileName: string;
}

export default function DownloadAction({
  categoryId,
  policyId,
  fileId,
  fileName,
}: IProp) {
  const size = "30px";
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
        },
      }
    );
  };

  return (
    <Flex
      bgColor={customColors.BLUE_BERRY_400}
      justifyContent={"center"}
      alignItems={"center"}
      w={size}
      cursor={"pointer"}
      h={size}
      borderRadius={"8px"}
      onClick={handleClick}
    >
      <FileDownloadBent style={{ fontSize: "16px" }} color="#fff" />
    </Flex>
  );
}
