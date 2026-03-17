import { Flex, Switch, useDisclosure } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { RemoveThin, Trash } from "react-huge-icons/outline";
import CustomInput from "../../../../components/common/CustomInput";
import CustomModal from "../../../../components/common/CustomModal";
import CustomButton from "../../../../components/DesignSystem/CustomButton";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";
import EventBus from "../../../../EventBus";
import { ISubCategory } from "../../../../hooks/useGetLoanCategories";
import useUpdateCategory from "../../../../hooks/useUpdateCategory";
import { selectedCategoryAtom } from "../utils/atom";
import styles from "../utils/styles.module.css";

const ctaStyles = "text-sm font-semibold grow h-[44px]";

export const EVENT_OPEN_EDIT_CATEGORY_MODAL = "EVENT_OPEN_EDIT_CATEGORY_MODAL";

export default function EditCategoryModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { mutate, isLoading } = useUpdateCategory();
  const selectedCategory = useAtomValue(selectedCategoryAtom);
  const [name, setName] = useState<string>("");
  const [subCatagories, setSubCategories] = useState<ISubCategory[]>([]);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setError(false);
  }, [isOpen]);

  useEffect(() => {
    setName(selectedCategory?.category_type!);
    setSubCategories(selectedCategory?.subcategories!);
  }, [isOpen, selectedCategory]);

  const handleToggleDisabled = (subCategoryId: string) => {
    setSubCategories((prevSubCategories) =>
      prevSubCategories.map((sub) =>
        sub.id === subCategoryId
          ? { ...sub, is_disabled: !sub.is_disabled }
          : sub
      )
    );
  };

  const handleDeleteSubCat = (subCategoryId: string) => {
    setSubCategories((prevSubCategories) =>
      prevSubCategories.map((sub) =>
        sub.id === subCategoryId
          ? { ...sub, is_disabled: true, is_active: false }
          : sub
      )
    );
  };

  const isDisabled = useMemo(() => !name?.trim(), [name]);

  const handleSubmit = () => {
    mutate(
      {
        id: selectedCategory?.id!,
        category_type: name
          .trim()
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" "),
        subcategories: subCatagories,
        is_disabled: false,
      },
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
  };
  const activeSubCategories = subCatagories?.filter((item) => item.is_active);

  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_EDIT_CATEGORY_MODAL, onOpen);
    return () => EventBus.getInstance().removeListener(onOpen);
  }, []);

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col w-[424px] max-h-[396px] overflow-y-auto rounded-[8px] p-4 gap-4 bg-white">
        <div className="flex flex-row justify-between">
          <CustomText stylearr={[20, 28, 500]} color={"#101828"}>
            Edit Category
          </CustomText>
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
        </div>
        {activeSubCategories?.length ? (
          <div
            className={`flex flex-col gap-[10px] overflow-y-auto ${styles.thinScrollbar}`}
          >
            <CustomText stylearr={[14, 22, 400]} color={"#111827"}>
              Sub-Categories
            </CustomText>
            {activeSubCategories?.map((sub) => (
              <div
                key={`sub-id${sub.id}`}
                className="flex flex-row justify-between items-center h-[42px]"
              >
                <CustomText stylearr={[12, 16, 600]} color={"#111827"}>
                  {sub?.category_type}
                </CustomText>
                <div className="flex flex-row gap-4">
                  <Switch
                    colorScheme="blue"
                    sx={{
                      "& .chakra-switch__track[data-checked]": {
                        backgroundColor: "#2F78EE",
                      },
                    }}
                    isChecked={!sub?.is_disabled}
                    isDisabled={isLoading}
                    onChange={() => handleToggleDisabled(sub.id)}
                  />
                  <Flex
                    bgColor={"#FFD8D44D"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    w={"20px"}
                    h={"20px"}
                    borderRadius={"8px"}
                    cursor={"pointer"}
                    onClick={() => handleDeleteSubCat(sub.id)}
                  >
                    <Trash style={{ fontSize: "16px" }} color="#E64A19" />
                  </Flex>
                </div>
              </div>
            ))}
          </div>
        ) : null}

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
            isDisabled={isDisabled || isLoading || error}
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
