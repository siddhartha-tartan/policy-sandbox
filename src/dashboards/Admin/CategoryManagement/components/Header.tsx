import { PlusThin } from "react-huge-icons/outline";
import CustomButton from "../../../../components/DesignSystem/CustomButton";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";
import EventBus from "../../../../EventBus";
import { EVENT_OPEN_ADD_CATEGORY_MODAL } from "./AddCategoryModal";
import { EVENT_OPEN_ADD_SUBCATEGORY_MODAL } from "./AddSubCategoryModal";

export default function Header() {
  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col gap-2">
        <CustomText stylearr={[22, 26, 700]}>
          Policy Category Management
        </CustomText>
        <CustomText stylearr={[12, 14, 600]} color={"#555557"}>
          Add, edit, or disable categories and sub-categories with ease
        </CustomText>
      </div>
      <div className="flex flex-row gap-4">
        <CustomButton
          variant="quaternary"
          className="font-semibold h-12 w-[189px]"
          leftIcon={<PlusThin fontSize={"20px"} />}
          onClick={() =>
            EventBus.getInstance().fireEvent(EVENT_OPEN_ADD_CATEGORY_MODAL)
          }
        >
          Add Category
        </CustomButton>
        <CustomButton
          variant="tertiary"
          className="font-semibold h-12 px-6 w-[216px]"
          style={{ borderColor: "#3762DD", color: "#3762DD" }}
          leftIcon={<PlusThin fontSize={"20px"} />}
          onClick={() =>
            EventBus.getInstance().fireEvent(EVENT_OPEN_ADD_SUBCATEGORY_MODAL)
          }
        >
          Add Sub-Category
        </CustomButton>
      </div>
    </div>
  );
}
