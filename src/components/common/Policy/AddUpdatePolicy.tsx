import { Flex, Spinner, Tooltip } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { useParams } from "react-router-dom";
import { MODIFY_POLICY_DETAILS } from "../../../dashboards/Spoc/Policy/pages/ModifyPolicy/components/EditPolicyMode";
import { systemColors } from "../../DesignSystem/Colors/SystemColors";
import CustomText from "../../DesignSystem/Typography/CustomText";
import CommonLoanCategoryDropdown from "../CommonLoanCategoryDropdown";
import CustomDate from "../CustomDate";
import CustomInput from "../CustomInput";
import CustomTextarea from "../CustomTextarea";
import PolicyUpload, { POLICY_UPLOAD } from "./components/PolicyUpload";
import useGetFile from "./hooks/useGetFile";
import { PolicyDetails } from "./hooks/useGetPolicyDetails";
import DocViewer from "../DocViewer";
import { userStore } from "../../../store/userStore";

type PolicyDetailKey = keyof PolicyDetails;
interface ConfigItem {
  label: string;
  info?: string;
  type?: React.ComponentType<any> | null;
  id: PolicyDetailKey;
  required: boolean;
  options?: { value: string; label: string }[];
  min?: string;
}
type Config = ConfigItem[][];
export const today = new Date().toISOString().split("T")[0];

const config: Config = [
  [
    {
      label: "Product Category",
      // info: "This is loan cateogy",
      type: CommonLoanCategoryDropdown,
      id: "loan_category_id",
      required: true,
      options: [],
    },
  ],
  [
    {
      label: "Policy Name",
      type: CustomInput,
      id: "name",
      required: true,
    },
  ],
  [
    {
      label: "Policy Key Highlights",
      type: CustomTextarea,
      id: "description",
      required: false,
    },
  ],
  [
    {
      label: "Review Date",
      type: CustomDate,
      id: "validity",
      required: false,
      min: today,
    },
  ],
];

const pdf_config: ConfigItem = {
  label: "Upload Policy Document",
  type: null,
  id: "pdf_url",
  required: true,
};

const LabelHeader = ({ data }: { data: ConfigItem }) => {
  return (
    <Flex alignItems={"center"} gap={"16px"}>
      <Flex gap={"2px"}>
        <CustomText stylearr={[14, 22, 500]} color={systemColors.black[900]}>
          {data.label}
        </CustomText>
        {data.required && (
          <CustomText stylearr={[14, 22, 500]} color={systemColors.error[600]}>
            *
          </CustomText>
        )}
      </Flex>
      {data.info && (
        <Tooltip hasArrow label={data.info}>
          <span>
            <CiCircleInfo size={"20px"} />
          </span>
        </Tooltip>
      )}
    </Flex>
  );
};

const ConfigItemComponent = ({
  col,
  data,
  edit,
  loanCategoriesOptions,
  error,
  handleChange,
  handleBlur,
}: {
  col: ConfigItem;
  data: MODIFY_POLICY_DETAILS;
  edit: boolean;
  loanCategoriesOptions: { value: string; label: string }[];
  error: Record<string, string>;
  handleChange: (id: PolicyDetailKey, value: any) => void;
  handleBlur: (id: PolicyDetailKey, value: string) => void;
}) => {
  const Comp = col.type;
  if (!Comp) return null;

  let compProps: any = { value: data?.[col.id], w: "full" };
  if (col.options) compProps["options"] = col.options;
  if (col.type === CustomDate) compProps["min"] = col?.min;
  if (col.id === "loan_category") {
    compProps.options = loanCategoriesOptions;
    compProps.type = "category";
  }

  return (
    <Flex gap={"10px"} flexDir={"column"} flex={1}>
      <LabelHeader data={col} />
      <Comp
        isDisabled={!edit}
        h="56px"
        onChange={(e: any) => {
          let value;
          if (col.options) value = e;
          else value = e.target.value;
          handleChange(col.id, value);
        }}
        onBlur={(e: any) => {
          handleBlur(col.id, e.target.value);
        }}
        {...compProps}
      />
      {error?.[col.id] && (
        <CustomText stylearr={[12, 14, 400]} color={systemColors.error[600]}>
          {error?.[col.id]}
        </CustomText>
      )}
    </Flex>
  );
};

export default function AddUpdatePolicy({
  edit,
  data,
  setData,
}: {
  edit: boolean;
  data: MODIFY_POLICY_DETAILS;
  setData: (e: MODIFY_POLICY_DETAILS) => void;
}) {
  const file: POLICY_UPLOAD = {
    file: data?.file,
    error: data?.error,
    url: data?.url,
  };

  const { id } = useParams<{ id: string }>();
  const { mutate, isLoading, data: fileData } = useGetFile();
  const [error, setError] = useState<Record<string, string>>({});
  const { editableLoanCategories } = userStore();

  const loanCategoriesOptions = useMemo(() => {
    if (!editableLoanCategories) return [];
    const options = editableLoanCategories
      ?.filter((item) => item.access_type === "edit")
      ?.map((cat) => ({
        value: cat.id,
        label: cat.category_type,
      }))
      .filter((row) => row.value);

    return options;
  }, [editableLoanCategories?.length]);

  const getFile = () => {
    mutate({
      category_id: data?.loan_category_id || "",
      policy_id: id || "",
      file_id: data?.pdf_url || "",
    });
  };

  useEffect(() => {
    if (data?.loan_category_id && id && data?.pdf_url) getFile();
  }, []);

  const setFile = (e: POLICY_UPLOAD) => {
    const temp: MODIFY_POLICY_DETAILS = { ...data, ...e };
    setData(temp);
  };

  const handleChange = (id: PolicyDetailKey, value: any) => {
    setData({ ...data, [id]: value });
  };

  const handleBlur = (id: PolicyDetailKey, value: string) => {
    if (value && id === "validity" && value <= today) {
      setError((prev) => ({ ...prev, [id]: "Invalid Date" }));
    } else {
      setError((prev) => ({ ...prev, [id]: "" }));
    }
  };

  return (
    <Flex gap={"24px"} flexDir={"column"} overflowY={"scroll"}>
      <Flex gap={"24px"} flexDir={"column"}>
        {config?.map((row, rowIdx) => (
          <Flex gap={"24px"} w={"full"} flexGrow={1} key={rowIdx}>
            {row?.map((col, colIdx) => (
              <ConfigItemComponent
                key={colIdx}
                col={col}
                data={data}
                edit={edit}
                loanCategoriesOptions={loanCategoriesOptions}
                error={error}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            ))}
          </Flex>
        ))}
      </Flex>
      {edit ? (
        <Flex gap={"10px"} flexDir={"column"}>
          <LabelHeader data={pdf_config} />
          <PolicyUpload file={file} setFile={setFile} name={data?.file_name} />
        </Flex>
      ) : (
        <>
          {isLoading ? (
            <Flex w={"full"} justifyContent={"center"} alignItems={"center"}>
              <Spinner />
            </Flex>
          ) : (
            <>
              {fileData?.htmlContent && (
                <DocViewer
                  htmlContent={fileData.htmlContent}
                  fileName={fileData.file_name}
                />
              )}
            </>
          )}
        </>
      )}
    </Flex>
  );
}
