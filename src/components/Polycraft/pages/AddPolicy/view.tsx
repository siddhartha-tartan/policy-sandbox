import { Divider, Flex, useDisclosure } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetPreSignedUrl from "../../../../dashboards/Spoc/Policy/pages/AddPolicy/hooks/useGetPreSignedUrl";
import { MODIFY_POLICY_DETAILS } from "../../../../dashboards/Spoc/Policy/pages/ModifyPolicy/components/EditPolicyMode";
import { queryClient } from "../../../../ProviderWrapper";
import { userStore } from "../../../../store/userStore";
import { BASE_ROUTES, UserType } from "../../../../utils/constants/constants";
import FormHeader from "../../../common/FormHeader";
import HeaderBackCta from "../../../common/HeaderBackCta";
import PageLayout from "../../../common/PageLayout";
import useAddPolicy, {
  EDIT_POLICY,
} from "../../../common/Policy/hooks/useAddPolicy";
import { initPolicyDetails } from "../../../common/Policy/hooks/useGetPolicyDetails";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../DesignSystem/CustomButton";
import EditConfirmationModal from "../../components/EditConfirmationModal";
import { POLYCRAFT_SUB_ROUTES } from "../../constants";
import { getPoliciesKey } from "../../hooks/useGetPolicies";
import { isPresignedUploadingAtom } from "../../polycraftAtom";
import { isAddUpdatePolicyValid } from "../../uitls/helper";
import AddEditPolicy from "../AddEditPolicy/view";

export default function AddPolicy() {
  const navigate = useNavigate();
  const { userType } = userStore();
  const [policyDetails, setPolicyDetails] =
    useState<MODIFY_POLICY_DETAILS>(initPolicyDetails);
  const isValid = isAddUpdatePolicyValid(policyDetails);
  const { mutate, isLoading: isAddLoading } = useAddPolicy();
  const { mutate: mutateFileUpload, isLoading: isFileUploading } =
    useGetPreSignedUrl();
  const [presignedUploading, setPresignedUploading] = useAtom(
    isPresignedUploadingAtom
  );
  const { isOpen, onClose, onOpen } = useDisclosure();
  useEffect(() => setPresignedUploading(false), []);

  const handleClick = ({
    priority,
    comment,
  }: {
    priority: string;
    comment: string;
  }) => {
    let payload: EDIT_POLICY = {
      policy_name: policyDetails?.name || "",
      description: policyDetails?.description || "",
      loan_category_id:
        policyDetails?.subcategory_id || policyDetails?.loan_category_id || "",
      notify_users: false,
      validity: null,
      priority: priority,
      comment: comment,
      change_type: "new_upload",
    };
    if (policyDetails?.file) {
      payload["policy_files"] = [{ file_name: policyDetails?.file?.name }];
    }
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
                queryClient.invalidateQueries(getPoliciesKey);
                navigate(
                  `${BASE_ROUTES[userType]}/polycraft/${POLYCRAFT_SUB_ROUTES.POLICIES}`
                );
              },
            }
          );
        } else {
          onClose();
          navigate(
            `${BASE_ROUTES[userType]}/polycraft/${POLYCRAFT_SUB_ROUTES.POLICIES}`
          );
        }
      },
    });
  };
  const loading = isAddLoading || isFileUploading || presignedUploading;
  const isSpoc = userType === UserType.SPOC;
  return (
    <PageLayout>
      <Flex
        p={"24px"}
        bgColor={systemColors.white.absolute}
        borderRadius={"16px"}
        flexDir={"column"}
        gap={"48px"}
      >
        <HeaderBackCta
          navigateTo={`${BASE_ROUTES[userType]}/polycraft/${POLYCRAFT_SUB_ROUTES.POLICIES}`}
        />
        <Flex flexDir={"column"} gap={"24px"} w={"full"}>
          {isSpoc && (
            <FormHeader w={"full"} h="56px" headerText={"Add New Policy"} />
          )}
          <AddEditPolicy
            edit={true}
            data={policyDetails}
            setData={setPolicyDetails}
          />
          <Divider />
        </Flex>
        <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
          <Flex />
          <Flex gap={"24px"} alignItems={"center"}>
            <CustomButton
              fontSize={"16px"}
              fontWeight={700}
              borderRadius={"10px"}
              isDisabled={!isValid}
              onClick={onOpen}
              isLoading={loading}
              w="165px"
              h="56px"
            >
              Publish
            </CustomButton>
          </Flex>
        </Flex>
      </Flex>
      <EditConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleClick}
        isLoading={loading}
      />
    </PageLayout>
  );
}
