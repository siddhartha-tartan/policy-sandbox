import { regexWebsiteUrl } from "../../../../utils/common/regex";
import {
  FormTypes,
  IFormConfig,
  TFormValidators,
} from "../../../forms/utils/data";

export const AddLinkFormConfig: IFormConfig = {
  title: "",
  formFields: [
    {
      inputKey: "link_name",
      label: "Title",
      placeholder: "Enter Title",
      type: FormTypes.TEXT,
      required: true,
      validators: "link_name",
    },
    {
      inputKey: "description",
      label: "Details",
      placeholder: "Enter Details",
      type: FormTypes.TEXT,
      required: true,
      validators: "link_description",
    },
    {
      inputKey: "url",
      label: "Link URL",
      placeholder: "Enter Link URL",
      type: FormTypes.TEXT,
      required: true,
      validators: "url",
    },
  ],
  ctaText: "",
};

export const linkFormValidators: TFormValidators = {
  link_name: (value) => {
    const stringValue = `${value}`.trim();
    if (stringValue.length === 0) {
      return "Title is required";
    }
    if (stringValue.length > 40) {
      return "Title must be 40 characters or less";
    }
  },
  link_description: (value) => {
    const stringValue = `${value}`.trim();
    if (stringValue.length === 0) {
      return "Details are required";
    }
    if (stringValue.length > 80) {
      return "Details must be 80 characters or less";
    }
  },
  url: (value) => {
    if (!regexWebsiteUrl.test(`${value}`)) {
      return "Invalid URL";
    }
  },
};
