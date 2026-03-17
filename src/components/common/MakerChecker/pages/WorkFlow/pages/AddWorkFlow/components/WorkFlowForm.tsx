import { GridItem, SimpleGrid } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { userStore } from "../../../../../../../../store/userStore";
import CustomText from "../../../../../../../DesignSystem/Typography/CustomText";
import useGetModules from "../../../../Modules/hooks/useGetModules";
import { workflowFormDataAtom } from "../../../atom";
import { addWorkFlowConfig } from "../utils/config";

interface FormFieldProps {
  item: any;
  formData: any;
  setFormData: (data: any) => void;
  moduleOptions: any[];
  categoryOptions: any[];
  shouldShowRecentActivity: boolean;
}

const FormField = ({
  item,
  formData,
  setFormData,
  moduleOptions,
  categoryOptions,
  shouldShowRecentActivity,
}: FormFieldProps) => {
  const Comp = item.type;
  let compProps: any = {
    value: formData?.[item.apiKey],
    w: "full",
    placeholder: item.placeholder,
    className: "h-[40px]",
  };

  if (item.apiKey === "module_id") {
    compProps = {
      ...compProps,
      options: moduleOptions,
      value: formData?.module_id || [],
    };
  } else if (item.apiKey === "entity_types") {
    compProps = {
      ...compProps,
      options: categoryOptions,
      value: formData?.entity_types || [],
      isSingleSelect: true,
    };
  }

  const handleChange = (e: any) => {
    const value = Array.isArray(e) ? e : e?.target?.value ?? e;
    if (item?.apiKey) {
      setFormData({ ...formData, [item.apiKey]: value });
    }
  };

  return (
    <GridItem
      colSpan={shouldShowRecentActivity ? 2 : item.columns}
      key={item.apiKey}
      className="flex grow"
    >
      <div
        className={`flex flex-col gap-[10px] w-full ${
          shouldShowRecentActivity && "p-4 border rounded-[16px]"
        }`}
      >
        <div className="flex flex-col gap-[2px]">
          <CustomText stylearr={[15, 18, 600]}>
            {item.label}{" "}
            {item.required && <span style={{ color: "red" }}>*</span>}
          </CustomText>
          {!shouldShowRecentActivity && (
            <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
              {item.description}
            </CustomText>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <Comp h="40px" onChange={handleChange} {...compProps} />
        </div>
      </div>
    </GridItem>
  );
};

const WorkFlowForm = ({
  shouldShowRecentActivity,
}: {
  shouldShowRecentActivity: boolean;
}) => {
  const { data: modules } = useGetModules();
  const { loanCategories } = userStore();
  const [formData, setFormData] = useAtom(workflowFormDataAtom);

  const moduleOptions = useMemo(() => {
    return modules?.length
      ? modules
          ?.map((item) => ({
            label: item?.name,
            value: item?.id,
          }))
          ?.filter((item) => !!item.value)
      : [];
  }, [modules?.length]);

  const categoryOptions = useMemo(() => {
    return loanCategories
      ?.map((item) => ({
        label: item.category_type,
        value: item.id,
      }))
      ?.filter((item) => !!item.value);
  }, [loanCategories]);

  return (
    <SimpleGrid
      columns={shouldShowRecentActivity ? 1 : 2}
      className="w-full h-full"
      spacingX={6}
      spacingY={4}
    >
      {addWorkFlowConfig?.map((item) => (
        <FormField
          key={item.apiKey}
          item={item}
          formData={formData}
          setFormData={setFormData}
          moduleOptions={moduleOptions}
          categoryOptions={categoryOptions}
          shouldShowRecentActivity={shouldShowRecentActivity}
        />
      ))}
    </SimpleGrid>
  );
};

export default WorkFlowForm;
