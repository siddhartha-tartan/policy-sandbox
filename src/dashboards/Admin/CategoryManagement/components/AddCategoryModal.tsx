import { useDisclosure } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { RemoveThin } from "react-huge-icons/outline";
import CustomInput from "../../../../components/common/CustomInput";
import CustomModal from "../../../../components/common/CustomModal";
import CustomButton from "../../../../components/DesignSystem/CustomButton";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";
import EventBus from "../../../../EventBus";
import useAddCategory from "../hooks/useAddCategory";

const ctaStyles = "text-sm font-semibold grow h-[44px]";

export const EVENT_OPEN_ADD_CATEGORY_MODAL = "EVENT_OPEN_ADD_CATEGORY_MODAL";

export default function AddCategoryModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [name, setName] = useState("");
  const { mutate, isLoading } = useAddCategory();
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_ADD_CATEGORY_MODAL, onOpen);
    return () => EventBus.getInstance().removeListener(onOpen);
  }, []);

  useEffect(() => {
    setName("");
    setError(false);
  }, [isOpen]);

  const handleSubmit = useCallback(() => {
    const capitalized = name
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    mutate(
      { category_type: capitalized },
      {
        onSuccess() {
          onClose();
        },
        onError(err) {
          //@ts-ignore
          if (err?.response?.data?.status_code === 1048) {
            setError(true);
          }
        },
      }
    );
  }, [name]);

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col w-[424px] rounded-[8px] p-4 gap-4 bg-white">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <CustomText stylearr={[20, 28, 500]} color={"#101828"}>
              Add Category
            </CustomText>
            <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
              Enter category name below
            </CustomText>
          </div>
          <RemoveThin
            fontSize={"28px"}
            className="cursor-pointer"
            onClick={onClose}
          />
        </div>
        <div className="flex flex-col gap-[10px]">
          <CustomText stylearr={[14, 22, 400]} color={"#111827"}>
            Category Name
          </CustomText>
          <CustomInput
            value={name}
            onChange={(e) => {
              setError(false);
              setName(e.target.value);
            }}
            placeholder="Enter category name"
            style={{
              height: "54px",
              fontSize: "14px",
              lineHeight: "22px",
              fontWeight: 400,
              color: "#141414",
              paddingRight: "20px",
              paddingLeft: "20px",
              ...(error && {
                borderColor: "#E64A19",
                background: "#FFD8D44D",
              }),
            }}
          />
          {error && (
            <CustomText stylearr={[12, 18, 400]} color={"#E64A19"}>
              Category name already exists. Please choose a different name.
            </CustomText>
          )}

          <CustomText stylearr={[12, 18, 400]} color={"#111827"}>
            <span style={{ fontWeight: 700 }}>Note:</span> A category once
            created cannot be deleted.
          </CustomText>
        </div>
        <div className="flex flex-row gap-6">
          <CustomButton
            variant="tertiary"
            className={ctaStyles}
            style={{ borderColor: "#ABAAAD", color: "#555557" }}
            onClick={onClose}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant="quaternary"
            className={ctaStyles}
            isDisabled={!name.trim() || isLoading || error}
            isLoading={isLoading}
            onClick={handleSubmit}
          >
            Save
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}
