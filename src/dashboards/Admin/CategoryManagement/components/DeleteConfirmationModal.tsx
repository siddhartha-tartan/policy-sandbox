import { useDisclosure, Image } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import CustomModal from "../../../../components/common/CustomModal";
import CustomButton from "../../../../components/DesignSystem/CustomButton";
import EventBus from "../../../../EventBus";
import useUpdateCategory from "../../../../hooks/useUpdateCategory";
import { selectedCategoryAtom } from "../utils/atom";
import image from "../../../../assets/Images/Caution.png";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";

const ctaStyles = "text-sm font-semibold grow h-[44px]";

export const EVENT_OPEN_DELETE_CONFIRMATION_MODAL =
  "EVENT_OPEN_DELETE_CONFIRMATION_MODAL";

export default function DeleteConfirmationModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { mutate, isLoading } = useUpdateCategory();
  const data = useAtomValue(selectedCategoryAtom);

  useEffect(() => {
    EventBus.getInstance().addListener(
      EVENT_OPEN_DELETE_CONFIRMATION_MODAL,
      onOpen
    );
    return () => EventBus.getInstance().removeListener(onOpen);
  }, []);

  const handleCategoryStatusChange = () => {
    mutate(
      {
        id: data?.id!,
        category_type: data?.category_type!,
        subcategories: data?.subcategories!,
        is_disabled: data?.is_active!,
      },
      {
        onSuccess() {
          onClose();
        },
      }
    );
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col w-[484px] rounded-[12px] p-6 gap-6 bg-white mx-auto">
        <Image src={image} className="w-[60px] h-[60px] mx-auto" />
        <CustomText
          stylearr={[14, 18, 600]}
          color={"#141414"}
          textAlign={"center"}
        >
          {`Are you sure you want to disable "${data?.category_type}"? Disabling this will hide all related policies until
          re-enabled.`}
        </CustomText>
        <div className="flex flex-row gap-4">
          <CustomButton
            variant="tertiary"
            className={ctaStyles}
            style={{ borderColor: "#ABAAAD", color: "#555557" }}
            onClick={onClose}
          >
            No, Go Back
          </CustomButton>
          <CustomButton
            variant="quaternary"
            className={ctaStyles}
            isDisabled={isLoading}
            isLoading={isLoading}
            onClick={handleCategoryStatusChange}
          >
            Yes, Disable It
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}
