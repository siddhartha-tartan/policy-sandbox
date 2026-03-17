export interface ColumnConfig {
  id: string;
  title: string;
  isVisible: boolean;
  isMandatory: boolean;
}

export const PolicyTableColumnConfig: ColumnConfig[] = [
  {
    id: "policy_name",
    title: "Policy Name",
    isVisible: true,
    isMandatory: true,
  },
  {
    id: "created_by",
    title: "Policy Owner",
    isVisible: true,
    isMandatory: true,
  },
  {
    id: "loan_category_name",
    title: "Category",
    isVisible: true,
    isMandatory: true,
  },
  {
    id: "subcategory",
    title: "Sub Category",
    isVisible: true,
    isMandatory: false,
  },
  { id: "status", title: "Status", isVisible: true, isMandatory: true },
  {
    id: "created_at",
    title: "Created on",
    isVisible: true,
    isMandatory: false,
  },
  {
    id: "updated_at",
    title: "Last modified on",
    isVisible: true,
    isMandatory: false,
  },
  { id: "version", title: "Version", isVisible: true, isMandatory: true },
  { id: "actions", title: "Action", isVisible: true, isMandatory: true },
];
