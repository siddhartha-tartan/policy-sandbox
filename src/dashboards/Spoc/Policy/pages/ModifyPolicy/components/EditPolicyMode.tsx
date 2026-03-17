import { Flex, useDisclosure } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { useParams } from "react-router-dom";
import AddUpdatePolicy from "../../../../../../components/common/Policy/AddUpdatePolicy";
import { POLICY_UPLOAD } from "../../../../../../components/common/Policy/components/PolicyUpload";
import useEditPolicy, {
  EDIT_POLICY,
} from "../../../../../../components/common/Policy/hooks/useEditPolicy";
import {
  getPolicyDetails,
  PolicyDetails,
} from "../../../../../../components/common/Policy/hooks/useGetPolicyDetails";
import { isAddUpdatePolicyValid } from "../../../../../../components/common/Policy/utils";
import CustomCheckbox from "../../../../../../components/CustomCheckbox";
import CustomButton from "../../../../../../components/DesignSystem/CustomButton";
import { getPoliciesKey } from "../../../../../../components/Polycraft/hooks/useGetPolicies";
import { queryClient } from "../../../../../../ProviderWrapper";
import EditConfirmationModal from "../../../modal/EditConfirmationModal";
import useGetPreSignedUrl from "../../AddPolicy/hooks/useGetPreSignedUrl";
import { isPresignedUploading } from "../../loadingAtom";

export interface MODIFY_POLICY_DETAILS
  extends PolicyDetails,
    Partial<POLICY_UPLOAD> {}
export default function EditPolicyMode({
  data,
  scrollToTop,
}: {
  data: PolicyDetails;
  scrollToTop: () => void;
}) {
  const [presignedUploading, setPresignedUploading] =
    useAtom(isPresignedUploading);
  useEffect(() => setPresignedUploading(false), []);
  const [edit, setEdit] = useState<boolean>(false);
  const [policyDetails, setPolicyDetails] =
    useState<MODIFY_POLICY_DETAILS | null>(null);
  const { id } = useParams<{ id: string }>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isNotifyUsersChecked, setIsNotifyUsersChecked] =
    useState<boolean>(true);

  useEffect(() => {
    if (data) {
      const temp: MODIFY_POLICY_DETAILS = {
        ...data,
        file: policyDetails?.file ?? null,
        error: "",
        url: data?.pdf_url,
      };
      setPolicyDetails(temp);
    }
  }, [data]);

  const isValid = useCallback(() => {
    return policyDetails ? isAddUpdatePolicyValid(policyDetails) : false;
  }, [policyDetails]);

  const { isLoading: isEditLoading, mutate } = useEditPolicy();
  const { mutate: mutateFileUpload, isLoading: isFileUploading } =
    useGetPreSignedUrl("Updated");
  useEffect(() => {
    setEdit(false);
  }, [id]);

  const isLoading = isEditLoading || isFileUploading || presignedUploading;

  const handleSave = () => {
    let payload: EDIT_POLICY = {
      policy_name: policyDetails?.name ?? "",
      validity: policyDetails?.validity || null,
      description: policyDetails?.description ?? "",
      loan_category_id: policyDetails?.loan_category_id,
      notify_users: isNotifyUsersChecked,
      change_type: "version_upload",
    };
    if (policyDetails?.file) {
      payload["policy_files"] = [
        { file_name: policyDetails?.file?.name, id: policyDetails?.pdf_url },
      ];
    }

    const handleSuccess = () => {
      setEdit(false);
      onClose();
      queryClient.invalidateQueries(getPolicyDetails);
    };

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
                handleSuccess();
              },
            }
          );
        } else {
          handleSuccess();
        }
        queryClient.invalidateQueries(getPoliciesKey);
      },
    });
  };

  if (policyDetails) {
    return (
      <Flex
        flexDir={"column"}
        gap={"32px"}
        w={"full"}
        overflowY={"scroll"}
        flexGrow={1}
        h={"full"}
      >
        <AddUpdatePolicy
          edit={edit}
          data={policyDetails}
          setData={setPolicyDetails}
        />
        {edit ? (
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <CustomCheckbox
              isChecked={isNotifyUsersChecked}
              setIsChecked={setIsNotifyUsersChecked}
              fontSize="'16px"
              fontWeight="500"
              label="Notify all the users"
            />

            <CustomButton
              fontSize={"16px"}
              fontWeight={500}
              borderRadius={"10px"}
              w="209px"
              onClick={onOpen}
              isDisabled={!isValid()}
            >
              Save
            </CustomButton>
          </Flex>
        ) : (
          <Flex w={"full"} justifyContent={"flex-end"}>
            <CustomButton
              fontSize={"16px"}
              fontWeight={500}
              borderRadius={"10px"}
              w="209px"
              onClick={() => {
                setEdit(true);
                setTimeout(() => scrollToTop(), 0);
              }}
              rightIcon={<MdOutlineModeEditOutline fontSize={"24px"} />}
            >
              Modify
            </CustomButton>
          </Flex>
        )}
        <EditConfirmationModal
          isOpen={isOpen}
          isLoading={isLoading}
          onClose={onClose}
          onSave={() => {
            handleSave();
          }}
        />
      </Flex>
    );
  }

  return null;
}
