import { Feature } from "../../../../../../hooks/useGetFeatures";
import {
  regexEmail,
  regexMobileNumber,
} from "../../../../../../utils/common/regex";
import {
  FeatureIdentifiers,
  UserType,
} from "../../../../../../utils/constants/constants";
import { formatUserType } from "../../../../../../utils/helpers/formatUserType";
import {
  FormTypes,
  IFormConfig,
  OPTION,
  TFormValidators,
} from "../../../../../forms/utils/data";

const getOptions = (userType: UserType): OPTION[] => {
  const defaultOptions: OPTION[] = [
    { label: "User", value: UserType.STAFF_USER },
  ];

  const optionsMapper: Record<string, OPTION[]> = {
    [UserType.ADMIN]: [
      { label: formatUserType(UserType.ADMIN), value: UserType.ADMIN },
      {
        label: formatUserType(UserType.SPOC),
        value: UserType.SPOC,
      },
      {
        label: formatUserType(UserType.ASSESSMENT_MANAGER),
        value: UserType.ASSESSMENT_MANAGER,
      },
      {
        label: formatUserType(UserType.STAFF_USER),
        value: UserType.STAFF_USER,
      },
    ],
  };

  return optionsMapper[userType] || defaultOptions;
};

export const AddUserFormConfig = (
  userType: UserType,
  isEdit?: boolean,
): IFormConfig => ({
  title: "Add User",
  formFields: [
    {
      inputKey: "source_employee_id",
      label: "Employee Id",
      placeholder: "Enter Employee Id",
      type: FormTypes.TEXT,
      required: true,
      validators: undefined,
    },
    {
      inputKey: "email",
      label: "Employee Email",
      placeholder: "Enter Employee Email",
      type: FormTypes.TEXT,
      required: true,
      validators: "email",
      disabled: false,
    },
    {
      inputKey: "phone_number",
      label: "Mobile Number",
      placeholder: "Enter Mobile Number",
      type: FormTypes.TEXT,
      required: true,
      validators: "mobile",
    },
    {
      inputKey: "first_name",
      label: "Name",
      placeholder: "Enter Employee Name",
      type: FormTypes.TEXT,
      required: true,
      validators: undefined,
    },
    ...(isEdit
      ? []
      : [
          {
            inputKey: "user_type",
            label: "Role",
            placeholder: "Select Role",
            type: FormTypes.SELECT,
            required: true,
            validators: undefined,
            options: getOptions(userType),
            disabled: false,
          },
        ]),
  ],
  ctaText: "",
});

export const AddUserFormValidators: TFormValidators = {
  email: (value) => {
    if (!regexEmail.test(`${value}`)) {
      return "Invalid Email";
    }
  },
  mobile: (value) => {
    if (!regexMobileNumber.test(`${value}`)) {
      return "Invalid Mobile Number";
    }
  },
};

export const featureConfig = (enabledFeatures: Feature[]) => [
  {
    title: "PolyGPT",
    description: "AI assistant trained to answer policy related questions",
    label: FeatureIdentifiers.POLYGPT,
    value: enabledFeatures?.find(
      (feature) => feature?.name === FeatureIdentifiers.POLYGPT,
    )?.id!,
  },
  {
    title: "Compare Policies",
    description: "Compare different versions of the same policy ",
    label: FeatureIdentifiers.POLICY_COMPARISON,
    value: enabledFeatures?.find(
      (feature) => feature?.name === FeatureIdentifiers.POLICY_COMPARISON,
    )?.id!,
  },
  {
    title: "Assessments",
    description: "Create customized  questionnaires using AI",
    label: FeatureIdentifiers.AI_ASSESSMENT,
    value: enabledFeatures?.find(
      (feature) => feature?.name === FeatureIdentifiers.AI_ASSESSMENT,
    )?.id!,
  },
];
