import { IOption } from "../../dashboards/Spoc/Assessment/pages/IndivisualAssesment/hooks/useGetAssesment";
import { userStore } from "../../store/userStore";
import CommonDropdownComponent from "./CommonDropdownComponent";

const CommonLoanCategoryDropdown = ({
  value,
  onChange,
  options,
  ...props
}: {
  value: string;
  options?: IOption[];
  onChange: (e: string) => void;
}) => {
  const { loanCategories } = userStore();
  const dropdownOptions = options?.length
    ? options
    : loanCategories?.map((item) => ({
        label: item.category_type,
        value: item.id,
      })) || [];

  return (
    <CommonDropdownComponent
      {...props}
      title={"Select Product Category"}
      options={dropdownOptions}
      value={value}
      onChange={onChange}
    />
  );
};

export default CommonLoanCategoryDropdown;
