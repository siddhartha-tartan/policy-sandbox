import CustomInput from "../../../../../../CustomInput";
import MultiSelectDropdown from "../../../../../../MultiSelect";

export const addWorkFlowConfig = [
  {
    label: "Workflow Name",
    description: "Choose a name for this workflow",
    placeholder: "Enter Workflow Name",
    apiKey: "name",
    validator: "name",
    columns: 2,
    type: CustomInput,
    required: true,
  },
  {
    label: "Milestone",
    description:
      "Choose the system milestone where this workflow will be implemented",
    placeholder: "Select Milestone",
    apiKey: "module_id",
    validator: undefined,
    type: MultiSelectDropdown,
    options: [],
    columns: 1,
    required: true,
  },
  {
    label: "Category",
    description: "Select the type of approval workflow",
    placeholder: "Select Category",
    apiKey: "entity_types",
    validator: undefined,
    type: MultiSelectDropdown,
    options: [],
    columns: 1,
    required: true,
  },
];
