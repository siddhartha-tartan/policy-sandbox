import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetUserType from "../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../utils/constants/constants";
import HeaderBackCta from "../../../common/HeaderBackCta";
import PageLayout from "../../../common/PageLayout";
import DocViewer from "../../../common/DocViewer";
import useGetFile from "../../../common/Policy/hooks/useGetFile";
import useGetPolicyDetails from "../../../common/Policy/hooks/useGetPolicyDetails";
import PolicyInfoBox from "../../../common/Policy/IndivisualPolicyDetail/components/PolicyInfoBox";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import Action from "./components/Action";

export default function PolicyDetail() {
  const userType = useGetUserType();
  const { categoryId, policyId, fileId } = useParams<{
    categoryId: string;
    policyId: string;
    fileId: string;
  }>();
  const { data, isLoading } = useGetPolicyDetails(categoryId, policyId);
  const { mutate, isLoading: isFileLoading, data: fileData } = useGetFile();
  const navigate = useNavigate();

  const getFile = () => {
    mutate({
      category_id: categoryId!,
      policy_id: policyId!,
      file_id: fileId || data?.pdf_url!,
    });
  };

  useEffect(() => {
    if (!categoryId || !policyId || !fileId) {
      navigate(`${BASE_ROUTES[userType]}/policygen`);
    } else {
      getFile();
    }
  }, [categoryId, policyId, fileId]);

  return (
    <PageLayout>
      <HeaderBackCta navigateTo={-1} />
      <Flex
        borderRadius={"16px"}
        gap={"32px"}
        flexDir={"column"}
        bgColor={systemColors.white.absolute}
        p={6}
        w="full"
        h="full"
        overflowY={"auto"}
      >
        {!isLoading && data && fileId ? (
          <>
            <Flex
              w={"full"}
              h="full"
              flexGrow={1}
              gap={"32px"}
              overflowY={"auto"}
            >
              <Box className="w-full overflow-y-auto h-full flex-grow">
                {isFileLoading || !fileData ? (
                  <Flex
                    w={"full"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Spinner />
                  </Flex>
                ) : (
                  fileData?.htmlContent && (
                    <DocViewer
                      htmlContent={fileData.htmlContent}
                      fileName={fileData.file_name}
                      flexGrow={1}
                    />
                  )
                )}
              </Box>
              <PolicyInfoBox data={data} />
            </Flex>
            <div className="w-full">
              <Action fileId={fileId} />
            </div>
          </>
        ) : (
          <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1}>
            <Spinner />
          </Flex>
        )}
      </Flex>
    </PageLayout>
  );
}
