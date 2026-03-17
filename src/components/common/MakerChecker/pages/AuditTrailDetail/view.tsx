import { Box, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Chatting } from "react-huge-icons/outline";
import { useParams } from "react-router-dom";
import useGetUserType from "../../../../../hooks/useGetUserType";
import { userStore } from "../../../../../store/userStore";
import { BASE_ROUTES } from "../../../../../utils/constants/constants";
import { formatDateTimeString } from "../../../../../utils/helpers/formatDate";
import { getLoanCategoryTypeById } from "../../../../../utils/helpers/loanCategoryHelpers";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { CommentComponent } from "../../../CommentComponent/CommentComponent";
import HeaderBackCta from "../../../HeaderBackCta";
import PageLayout from "../../../PageLayout";
import PdfViewer2 from "../../../PdfViewer2";
import useGetFile from "../../../Policy/hooks/useGetFile";
import { ApproverStatusStepper } from "../../common/components/ApproverStatusStepper";
import { MAKER_CHECKER_SUB_ROUTES } from "../../utils/constant";
import useGetApprovalTimeline from "../ApprovalTimeline/hooks/useGetApprovalTimeline";
import { adaptTimelineResp } from "../ApprovalTimeline/utils/helpers";

const AuditTrailDetail = () => {
  const { id } = useParams();
  const { data } = useGetApprovalTimeline(id);
  const { mutate, isLoading, data: fileData } = useGetFile();
  const userType = useGetUserType();
  const [showComments, setShowComments] = useState(false);
  const { loanCategories } = userStore();

  const getFile = () => {
    mutate({
      category_id: data?.entity_data?.category_id!,
      policy_id: data?.entity_data?.policy_id!,
      file_id: data?.entity_data?.file_id!,
    });
  };

  useEffect(() => {
    if (
      data?.entity_data?.category_id &&
      data?.entity_data?.policy_id &&
      data?.entity_data?.file_id
    )
      getFile();
  }, [data]);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const rawStatus =
    data?.workflow_timeline?.[data?.current_level - 1]?.status || "";
  const formattedStatus = rawStatus
    .replace(/_/g, " ") // Replace underscores with spaces
    .toLowerCase() // Convert entire string to lowercase
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letter of each word

  const config = [
    {
      label: "Action Type",
      value:
        data?.entity_data?.event_type === "NEW_REQUEST"
          ? "Policy Upload"
          : "Policy Modification",
    },
    {
      label: "Category",
      value: getLoanCategoryTypeById(
        data?.entity_data?.category_id || "",
        loanCategories
      ),
    },
    { label: "Version", value: data?.entity_data?.version },
    {
      label: "Last Action Taken On",
      value: formatDateTimeString(new Date(data?.created_at!)),
    },
    {
      label: "Review Progress",
      value: `${formattedStatus} at L${data?.current_level}`,
    },
  ];

  return (
    <PageLayout>
      <HeaderBackCta
        navigateTo={`${BASE_ROUTES[userType]}/maker-checker/${MAKER_CHECKER_SUB_ROUTES.AUDIT_TRAIL}`}
      />
      <div className="flex flex-col gap-6 p-6 rounded-[16px] bg-white w-full h-[150dvh] overflow-y-auto">
        <CustomText stylearr={[22, 28, 700]} color={"#424242"}>
          {data?.entity_data?.policy_name}
        </CustomText>
        <div className="flex flex-col gap-8 p-4 border rounded-[16px]">
          <div className="flex flex-col justify-start gap-4">
            <CustomText stylearr={[19, 20, 700]} color={"#455A64"}>
              Action Summary
            </CustomText>
            <div className="flex flex-row justify-between">
              {config?.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col gap-[14px] ${
                    idx !== config.length - 1 && "mr-6"
                  }`}
                >
                  <CustomText stylearr={[12, 16, 400]} color={"#ABAAAD"}>
                    {item.label}
                  </CustomText>
                  <CustomText stylearr={[14, 18, 500]} color={"#424242"}>
                    {item.value}
                  </CustomText>
                </div>
              ))}
            </div>
          </div>
          <ApproverStatusStepper
            title={"Timeline of Approval"}
            data={adaptTimelineResp(data)}
          />
        </div>
        {isLoading || !fileData ? (
          <div className="w-full h-full flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div
            className={`flex flex-row h-full overflow-y-auto relative ${
              showComments && "gap-6"
            }`}
          >
            <Box
              className={`border rounded-[16px] p-4 pt-0 overflow-y-auto h-full transition-all duration-300 ease-in-out ${
                showComments ? "w-[calc(100%-371px)]" : "w-full"
              }`}
            >
              <div className="flex flex-col gap-6 h-full overflow-y-auto">
                <div className="flex border-b border-gray-200 flex-row justify-between my-auto items-end h-[60px]">
                  <div className="relative px-4 py-2 cursor-pointer">
                    <span className="text-[#3762DD] font-medium">
                      Policy Information
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3762DD]"></div>
                  </div>
                  <CustomButton
                    leftIcon={<Chatting fontSize={"12px"} />}
                    onClick={toggleComments}
                    variant="quinary"
                    height={"35px"}
                    my={"auto"}
                  >
                    {" "}
                    <div className="text-sm font-semibold text-[#3762DD]">
                      {showComments ? "Hide Comments" : "View Comments"}
                    </div>
                  </CustomButton>
                </div>

                <PdfViewer2
                  pdfUrl={fileData}
                  flexGrow={1}
                  refetch={getFile}
                  className="overflow-y-auto h-full"
                />
              </div>
            </Box>
            <div
              className={`h-[calc(100vh-200px)] transition-all duration-300 ease-in-out ${
                showComments
                  ? "w-[371px] translate-x-0"
                  : "w-0 translate-x-full"
              }`}
            >
              <div className="h-full">
                <CommentComponent requestId={id!} />
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AuditTrailDetail;
