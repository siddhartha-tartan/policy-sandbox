import { CloseIcon } from "@chakra-ui/icons";
import {
  HStack,
  IconButton,
  Radio,
  RadioGroup,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useMemo, useReducer } from "react";
import { ILoanCategory } from "../../../../../../hooks/useGetLoanCategories";
import useGetUserType from "../../../../../../hooks/useGetUserType";
import { userStore } from "../../../../../../store/userStore";
import { UserType } from "../../../../../../utils/constants/constants";
import { getLoanCategoryTypeById } from "../../../../../../utils/helpers/loanCategoryHelpers";
import { systemColors } from "../../../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import AppInputs from "../../../../../forms/AppInputs";
import { checkFormValidity } from "../../../../../forms/utils/checkFormValidity";
import { formErrorsReducer } from "../../../../../forms/utils/formErrorReducer";
import { formReducer } from "../../../../../forms/utils/formReducer";
import MultiSelectDropdown from "../../../../MultiSelect";
import { IAddUser } from "../../../hooks/useAddUsers";
import { IUserCategoryAccess } from "../../../hooks/useGetUsers";
import { AddUserFormConfig, AddUserFormValidators } from "../utils/config";

// Defining a type for basic info data (everything except feature_ids)
type BasicInfoData = Omit<IAddUser, "feature_ids">;

const MultiSelectCategoryAccessInput = ({
  value,
  handleChange,
  loanCategories,
}: {
  value: IUserCategoryAccess[] | null;
  handleChange: (e: IUserCategoryAccess[]) => void;
  loanCategories: ILoanCategory[];
}) => {
  const error =
    value?.length && value?.every((item) => item.access_type === "view")
      ? "User must have at least 1 product category with Edit access."
      : "";
  return (
    <div className="flex flex-col gap-4">
      <MultiSelectDropdown
        options={loanCategories?.map((row) => ({
          label: row?.category_type,
          value: row?.id,
        }))}
        value={value?.map((item) => item?.loan_category_id) || []}
        onChange={(e) =>
          handleChange(
            e?.map((item) => ({
              loan_category_id: item,
              loan_category_name: "",
              access_type: "edit",
            }))
          )
        }
        className="w-1/2"
        placeholder="Choose product categories with access"
      />
      <SimpleGrid gap={4} columns={2}>
        {value?.map((item) => (
          <div
            className="h-[40px] px-4 border rounded-[8px] flex flex-row justify-between w-full items-center"
            key={item.loan_category_id}
          >
            <CustomText stylearr={[12, 16, 600]} color={"#141414"}>
              {getLoanCategoryTypeById(item.loan_category_id, loanCategories)}
            </CustomText>
            <div className="flex flex row gap-2 items-center">
              <RadioGroup
                value={item.access_type!}
                onChange={(val: "view" | "edit") =>
                  handleChange(
                    value?.map((cat) => {
                      if (cat.loan_category_id === item.loan_category_id) {
                        return {
                          loan_category_id: cat.loan_category_id,
                          loan_category_name: cat.loan_category_name,
                          access_type: val,
                        };
                      } else return cat;
                    })
                  )
                }
              >
                <HStack gap={4}>
                  <Radio value="view" size={"sm"} colorScheme="gray">
                    <CustomText stylearr={[12, 18, 500]} color={"#555557"}>
                      View
                    </CustomText>
                  </Radio>
                  <Radio value="edit" size={"sm"} colorScheme="gray">
                    <CustomText stylearr={[12, 18, 500]} color={"#555557"}>
                      Edit
                    </CustomText>
                  </Radio>
                </HStack>
              </RadioGroup>
              <IconButton
                icon={
                  <CloseIcon
                    style={{ width: "8px", height: "8px" }}
                    fontSize={"14px"}
                  />
                }
                size="xs"
                aria-label="Remove"
                onClick={() =>
                  handleChange(
                    value?.filter(
                      (cat) => item.loan_category_id !== cat.loan_category_id
                    )
                  )
                }
              />
            </div>
          </div>
        ))}
      </SimpleGrid>
      <CustomText
        className="self-end w-full text-right"
        stylearr={[13, 20, 600]}
        color={systemColors.error[700]}
      >
        {error}
      </CustomText>
    </div>
  );
};

const MultiSelectCategoryInput = ({
  value,
  handleChange,
  loanCategories,
}: {
  value: IUserCategoryAccess[] | null;
  handleChange: (e: IUserCategoryAccess[]) => void;
  loanCategories: ILoanCategory[];
}) => {
  return (
    <MultiSelectDropdown
      options={loanCategories?.map((row) => ({
        label: row?.category_type,
        value: row?.id,
      }))}
      value={value?.map((item) => item?.loan_category_id) || []}
      onChange={(e) =>
        handleChange(
          e?.map((item) => ({
            loan_category_id: item,
            loan_category_name: "",
            access_type: null,
          }))
        )
      }
      className="w-1/2"
      placeholder="Choose product categories"
    />
  );
};

export default function BasicInfoForm({
  data,
  setData,
  setError,
  isEdit = false,
}: {
  data: BasicInfoData;
  setData: (e: BasicInfoData) => void;
  setError: (e: boolean) => void;
  isEdit?: boolean;
}) {
  const userType = useGetUserType();
  const formConfig = useMemo(
    () => AddUserFormConfig(userType, isEdit),
    [userType, isEdit]
  );
  const [state, dispatchValue] = useReducer(formReducer, data);
  const [errors, dispatchError] = useReducer(formErrorsReducer, {});
  const { editableLoanCategories } = userStore();

  useEffect(() => {
    setData({ ...data, ...state });
  }, [state]);

  useEffect(() => {
    if (checkFormValidity(errors, formConfig?.formFields, data)) {
      setError(true);
    } else {
      if (
        (data?.user_type !== UserType.ADMIN &&
          !data?.loan_category_access?.length) ||
        (data?.user_type === UserType.SPOC &&
          data?.loan_category_access?.every(
            (item) => item?.access_type === "view"
          ))
      ) {
        setError(true);
      } else {
        setError(false);
      }
    }
  }, [data, errors, formConfig?.formFields]);

  const handleInput = ({
    inputKey,
    value,
  }: {
    inputKey: string;
    value: string;
  }) => {
    if (inputKey === "user_type") {
      if (value === UserType.SPOC) {
        dispatchValue({
          inputKey: "loan_category_access",
          value: data?.loan_category_access?.map((item) => ({
            loan_category_id: item.loan_category_id,
            loan_category_name: item.loan_category_name,
            access_type: "edit",
          })),
        });
      } else if (value !== UserType.ADMIN) {
        dispatchValue({
          inputKey: "loan_category_access",
          value: data?.loan_category_access?.map((item) => ({
            loan_category_id: item.loan_category_id,
            loan_category_name: item.loan_category_name,
            access_type: null,
          })),
        });
      } else {
        dispatchValue({
          inputKey: "loan_category_access",
          value: null,
        });
      }
    }
  };

  const productCategoryInputField = useMemo(() => {
    const userTypeInput = state?.user_type;
    if (!userTypeInput || userTypeInput === UserType.ADMIN) return null;
    else if (userTypeInput === UserType.SPOC)
      return (
        <MultiSelectCategoryAccessInput
          value={state?.loan_category_access}
          handleChange={(val: IUserCategoryAccess[]) =>
            dispatchValue({
              inputKey: "loan_category_access",
              value: val,
            })
          }
          loanCategories={editableLoanCategories}
        />
      );
    else
      return (
        <MultiSelectCategoryInput
          value={state?.loan_category_access}
          handleChange={(val: IUserCategoryAccess[]) => {
            dispatchValue({
              inputKey: "loan_category_access",
              value: val,
            });
          }}
          loanCategories={editableLoanCategories}
        />
      );
  }, [state?.user_type, state?.loan_category_access, editableLoanCategories]);

  return (
    <div className="flex flex-col gap-6">
      <SimpleGrid columns={2} gap={4}>
        <AppInputs
          formConfig={formConfig}
          formFields={formConfig.formFields}
          formValue={state}
          formErrors={errors}
          formValidators={AddUserFormValidators}
          dispatchValue={dispatchValue}
          dispatchError={dispatchError}
          onInput={handleInput}
        />
      </SimpleGrid>
      {productCategoryInputField ? (
        <div className="flex flex-col gap-6 mt-2">
          <div className="flex flex-col gap-2">
            <CustomText stylearr={[16, 20, 600]} color={"#141414"}>
              Product Access
            </CustomText>
            <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
              Configure product category access permissions
            </CustomText>
          </div>
          {productCategoryInputField}
        </div>
      ) : null}
    </div>
  );
}
