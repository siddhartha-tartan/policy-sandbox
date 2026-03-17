import { Divider, Flex } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomCheckbox from "../../../../../components/CustomCheckbox";
import { systemColors } from "../../../../../components/DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../components/DesignSystem/CustomButton";
import FormHeader from "../../../../../components/common/FormHeader";
import PageLayout from "../../../../../components/common/PageLayout";
import AddUpdatePolicy from "../../../../../components/common/Policy/AddUpdatePolicy";
import useAddPolicy, {
  EDIT_POLICY,
} from "../../../../../components/common/Policy/hooks/useAddPolicy";
import { initPolicyDetails } from "../../../../../components/common/Policy/hooks/useGetPolicyDetails";
import { isAddUpdatePolicyValid } from "../../../../../components/common/Policy/utils";
import { BREADCRUMBS_POLICY } from "../../../../../components/common/Policy/utils/constants";
import useGetUserType from "../../../../../hooks/useGetUserType";
import {
  POLICY_ROUTES,
  UserType,
} from "../../../../../utils/constants/constants";
import { MODIFY_POLICY_DETAILS } from "../ModifyPolicy/components/EditPolicyMode";
import { isPresignedUploading } from "../loadingAtom";
import useGetPreSignedUrl from "./hooks/useGetPreSignedUrl";

export default function AddPolicy() {
  const [presignedUploading, setPresignedUploading] =
    useAtom(isPresignedUploading);

  useEffect(() => setPresignedUploading(false), []);
  const [policyDetails, setPolicyDetails] =
    useState<MODIFY_POLICY_DETAILS>(initPolicyDetails);
  const isValid = isAddUpdatePolicyValid(policyDetails);
  const userType = useGetUserType();
  const navigate = useNavigate();
  const { mutate, isLoading: isAddLoading } = useAddPolicy();
  const { mutate: mutateFileUpload, isLoading: isFileUploading } =
    useGetPreSignedUrl();
  const [isNotifyUsersChecked, setIsNotifyUsersChecked] =
    useState<boolean>(true);
  const handleClick = () => {
    let payload: EDIT_POLICY = {
      policy_name: policyDetails?.name || "",
      description: policyDetails?.description || "",
      loan_category_id: policyDetails?.loan_category_id || "",
      notify_users: isNotifyUsersChecked,
      validity: policyDetails?.validity || null,
      change_type: "new_upload",
    };
    if (policyDetails?.file) {
      payload["policy_files"] = [{ file_name: policyDetails?.file?.name }];
    }
    mutate(payload, {
      onSuccess(successData: any) {
        if (policyDetails?.file) {
          mutateFileUpload({
            category_id: successData?.loan_category_id,
            policy_id: successData?.id,
            file_id: successData?.policy_files?.[0]?.id,
            file: policyDetails.file,
          });
        }
      },
    });
  };
  const baseNav = `/${UserType[userType]}/policy`;
  const loading = isAddLoading || isFileUploading || presignedUploading;

  return (
    <PageLayout
      breadCrumbsData={[
        {
          label: BREADCRUMBS_POLICY.POLICIES,
          navigateTo: baseNav,
        },

        {
          label: BREADCRUMBS_POLICY.ADD_NEW_POLICY,
          navigateTo: "",
        },
      ]}
    >
      <Flex
        p={"24px"}
        bgColor={systemColors.white.absolute}
        borderRadius={"16px"}
        flexDir={"column"}
        gap={"48px"}
      >
        <Flex flexDir={"column"} gap={"24px"} w={"full"}>
          <FormHeader
            w={"full"}
            actionBackCTA={() => {
              navigate(`${POLICY_ROUTES[userType]}`);
            }}
            showBackCTA
            headerText={"Add New Policy"}
          />
          <AddUpdatePolicy
            edit={true}
            data={policyDetails}
            setData={setPolicyDetails}
          />
          <Divider />
        </Flex>
        <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
          <CustomCheckbox
            isChecked={isNotifyUsersChecked}
            setIsChecked={setIsNotifyUsersChecked}
            fontSize="'16px"
            fontWeight="500"
            label="Notify all the users"
          />
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
              w="165px"
              isDisabled={!isValid}
              isLoading={loading}
              h="56px"
              onClick={handleClick}
            >
              Save
            </CustomButton>
          </Flex>
        </Flex>
      </Flex>
    </PageLayout>
  );
}
