import { Flex, useDisclosure } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetPreSignedUrl from "../../../../dashboards/Spoc/Policy/pages/AddPolicy/hooks/useGetPreSignedUrl";
import { MODIFY_POLICY_DETAILS } from "../../../../dashboards/Spoc/Policy/pages/ModifyPolicy/components/EditPolicyMode";
import { queryClient } from "../../../../ProviderWrapper";
import { userStore } from "../../../../store/userStore";
import { BASE_ROUTES, UserType } from "../../../../utils/constants/constants";
import { EDIT_POLICY } from "../../../common/Policy/hooks/useAddPolicy";
import useEditPolicy from "../../../common/Policy/hooks/useEditPolicy";
import {
  getPolicyDetails,
  PolicyDetails,
} from "../../../common/Policy/hooks/useGetPolicyDetails";
import CustomButton from "../../../DesignSystem/CustomButton";
import EditConfirmationModal from "../../components/EditConfirmationModal";
import { POLYCRAFT_SUB_ROUTES } from "../../constants";
import { isPresignedUploadingAtom } from "../../polycraftAtom";
import { isAddUpdatePolicyValid } from "../../uitls/helper";
import AddEditPolicy from "../AddEditPolicy/view";
import EventBus from "../../../../EventBus";
import PolicySentModal, {
  EVENT_OPEN_POLICY_SENT_MODAL,
} from "../../components/PolicySentModal";

export default function EditPolicy({ data }: { data: PolicyDetails }) {
  const navigate = useNavigate();
  const { userType } = userStore();
  const [policyDetails, setPolicyDetails] = useState<MODIFY_POLICY_DETAILS>(
    //@ts-ignore
    {
      name: data?.name,
      description: data?.description,
      pdf_url: data?.pdf_url,
      loan_category: data?.loan_category,
      owner: data?.owner,
      published_on: data?.published_on,
      loan_category_id: data?.loan_category_id,
      subcategory_id: data?.subcategory_id,
      file_name: data?.file_name,
      validity: data?.validity,
      url: data?.pdf_url,
    }
  );

  const isValid = isAddUpdatePolicyValid(policyDetails);
  const { mutate, isLoading: isEditLoading } = useEditPolicy();
  const { mutate: mutateFileUpload, isLoading: isFileUploading } =
    useGetPreSignedUrl("updated");
  const [presignedUploading, setPresignedUploading] = useAtom(
    isPresignedUploadingAtom
  );
  useEffect(() => setPresignedUploading(false), []);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigateToViewPol = () =>
    navigate(
      `${
        BASE_ROUTES[userType]
      }/polycraft/${POLYCRAFT_SUB_ROUTES.VIEW_POLICY.replace(
        ":id",
        id || ""
      ).replace(":categoryId", categoryId || "")}`
    );

  const handleSave = ({
    priority,
    comment,
  }: {
    priority: string;
    comment: string;
  }) => {
    let payload: EDIT_POLICY = {
      policy_name: policyDetails?.name ?? "",
      validity: policyDetails?.validity || null,
      description: policyDetails?.description ?? "",
      loan_category_id: policyDetails?.loan_category_id,
      notify_users: false,
      priority: priority,
      comment: comment,
      change_type: policyDetails?.file ? "version_upload" : "version_upload",
    };
    if (policyDetails?.file) {
      payload["policy_files"] = [
        //@ts-ignore
        { file_name: policyDetails?.file?.name, id: policyDetails?.pdf_url },
      ];
    }
    //@ts-ignore
    mutate(payload, {
      onSuccess(successData: any) {
        if (policyDetails?.file) {
          mutateFileUpload(
            {
              category_id: successData?.loan_category_id,
              policy_id: successData?.id,
              file_id: successData?.policy_files?.[0]?.id,
              file: policyDetails.file,
            },
            {
              onSuccess() {
                onClose();
                setTimeout(
                  () =>
                    EventBus.getInstance().fireEvent(
                      EVENT_OPEN_POLICY_SENT_MODAL
                    ),
                  100
                );
                queryClient.invalidateQueries(getPolicyDetails);
              },
            }
          );
        } else {
          onClose();
          setTimeout(
            () =>
              EventBus.getInstance().fireEvent(EVENT_OPEN_POLICY_SENT_MODAL),
            100
          );
          queryClient.invalidateQueries(getPolicyDetails);
        }
      },
    });
  };
  const loading = isEditLoading || isFileUploading || presignedUploading;
  const isSpoc = userType === UserType.SPOC;
  const { categoryId, id } = useParams();

  return (
    <div className="w-full flex flex-col gap-[24px]">
      <AddEditPolicy
        edit={true}
        data={policyDetails}
        setData={setPolicyDetails}
      />
      <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
        <Flex />
        <Flex gap={"24px"} alignItems={"center"}>
          {/* <CustomButton
              fontSize={"16px"}
              fontWeight={700}
              variant="tertiary"
              h="56px"
              borderColor={systemColors.grey[800]}
              borderRadius={"10px"}
              onClick={() => {}}
            >
              Save as a draft
            </CustomButton> */}
          <CustomButton
            fontSize={"16px"}
            fontWeight={700}
            borderRadius={"10px"}
            isDisabled={!isValid}
            onClick={() => {
              if (isSpoc) {
                onOpen();
              }
            }}
            isLoading={loading}
            w="165px"
            h="56px"
          >
            Update
          </CustomButton>
        </Flex>
      </Flex>
      <EditConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        isLoading={loading}
      />
      <PolicySentModal onViewStatusClick={navigateToViewPol} />
    </div>
  );
}
