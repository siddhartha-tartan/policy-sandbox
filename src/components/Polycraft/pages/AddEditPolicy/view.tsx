import { Flex, Spinner, Tooltip } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { useParams } from "react-router-dom";
import { MODIFY_POLICY_DETAILS } from "../../../../dashboards/Spoc/Policy/pages/ModifyPolicy/components/EditPolicyMode";
import { userStore } from "../../../../store/userStore";
import CustomInput from "../../../common/CustomInput";
import CustomTextarea from "../../../common/CustomTextarea";
import DocViewer from "../../../common/DocViewer";
import PolicyUpload, {
  POLICY_UPLOAD,
} from "../../../common/Policy/components/PolicyUpload";
import useGetFile from "../../../common/Policy/hooks/useGetFile";
import { PolicyDetails } from "../../../common/Policy/hooks/useGetPolicyDetails";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import LoanCategoryDropdown from "../../components/LoanCategoryDropdown";

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

const config: Config = [
  [
    {
      label: "Product Category",
      type: LoanCategoryDropdown,
      id: "loan_category_id",
      required: true,
      options: [],
    },
    {
      label: "Product sub-category",
      type: LoanCategoryDropdown,
      id: "subcategory_id" as any,
      required: false,
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
      label: "Policy Description",
      type: CustomTextarea,
      id: "description",
      required: true,
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

export default function AddEditPolicy({
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
  const { loanCategories } = userStore();

  const mainCategoriesOptions = useMemo(() => {
    const options = loanCategories.map((cat) => ({
      value: cat?.id,
      label: cat?.category_type,
    }));
    return options;
  }, [loanCategories]);

  const selectedCategory = useMemo(
    () => loanCategories?.find((cat) => cat?.id === data?.loan_category_id),
    [loanCategories, data?.loan_category_id]
  );

  const subCategoriesOptions = useMemo(() => {
    if (!data?.loan_category_id) return [];
    const options = loanCategories
      ?.find((item) => item.id === data?.loan_category_id)
      ?.subcategories?.map((sub) => ({
        value: sub?.id,
        label: sub?.category_type,
      }));
    return options;
  }, [data?.loan_category_id]);

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

  return (
    <Flex gap={"24px"} flexDir={"column"} overflowY={"scroll"}>
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
      <Flex gap={"24px"} flexDir={"column"}>
        {config?.map((row, rowId) => (
          <Flex gap="24px" w="full" flexGrow={1} key={rowId}>
            {row?.map((col, colId) => {
              const Comp = col.type;
              if (!Comp) return null;

              let compProps: any = { value: data?.[col.id], w: "full" };

              if (col.id === "loan_category_id") {
                compProps.options = mainCategoriesOptions;
                compProps.type = "category";
              } else if (col.id === "subcategory_id") {
                compProps.options = subCategoriesOptions;
                compProps.type = "subCategory";
                compProps.parentCategory = selectedCategory;
              }

              return (
                <Flex gap="10px" flexDir="column" flex={1} key={colId}>
                  <LabelHeader data={col} />
                  <Comp
                    isDisabled={!edit}
                    h="56px"
                    onChange={(e: any) => {
                      const value = typeof e === "object" ? e.target?.value : e;

                      if (col.id === "loan_category_id") {
                        setData({
                          ...data,
                          [col.id]: value,
                          subcategory_id: "",
                        });
                      } else {
                        setData({ ...data, [col.id]: value });
                      }
                    }}
                    {...compProps}
                  />
                </Flex>
              );
            })}
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
