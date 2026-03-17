import { Divider, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { PlusThin, RemoveThin, Trash } from "react-huge-icons/outline";
import CommonDropdownComponent from "../../../../components/common/CommonDropdownComponent";
import CustomInput from "../../../../components/common/CustomInput";
import CustomModal from "../../../../components/common/CustomModal";
import GradientText from "../../../../components/common/GradientText/GradientText";
import CustomButton from "../../../../components/DesignSystem/CustomButton";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";
import EventBus from "../../../../EventBus";
import { ILoanCategory } from "../../../../hooks/useGetLoanCategories";
import useAddSubCategory from "../hooks/useAddSubCategory";
import styles from "../utils/styles.module.css";

export const EVENT_OPEN_ADD_SUBCATEGORY_MODAL =
  "EVENT_OPEN_ADD_SUBCATEGORY_MODAL";
const ctaStyles = "text-sm font-semibold grow h-[44px]";
interface IForm {
  name: string;
  categoryId: string;
}

const Form = ({
  data,
  index,
  setData,
  categories,
  error,
  setError,
  checkDuplicateNames,
}: {
  data: IForm;
  index: number;
  setData: React.Dispatch<React.SetStateAction<IForm[]>>;
  categories: ILoanCategory[];
  error: boolean[];
  setError: React.Dispatch<React.SetStateAction<boolean[]>>;
  checkDuplicateNames: (name: string, currentIndex: number) => boolean;
}) => {
  const categoryOptions =
    categories?.map((item) => ({
      label: item.category_type,
      value: item.id,
    })) || [];

  const handleRemoveForm = () => {
    setData((prev) => prev.filter((_, i) => i !== index));
    setError((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBlur = () => {
    if (data.name.trim()) {
      const isDuplicate = checkDuplicateNames(data.name, index);
      setError((prev) => {
        const newError = [...prev];
        newError[index] = isDuplicate;
        return newError;
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-[10px]">
        <div className="flex flex-row justify-between">
          {" "}
          <CustomText stylearr={[14, 22, 400]}>Sub-Category Name</CustomText>
          {index === 0 ? (
            <button
              className="flex flex-row gap-1 items-center cursor-pointer"
              onClick={() => {
                setData((prev) => [...prev, { name: "", categoryId: "" }]);
                setError((prev) => [...prev, false]);
              }}
            >
              <PlusThin fontSize={"20px"} color="#3762DD" />
              <GradientText
                text={"Add New"}
                gradient={
                  "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
                }
                className="text-sm font-semibold"
              />
            </button>
          ) : (
            <Trash className="cursor-pointer" onClick={handleRemoveForm} />
          )}
        </div>

        <CustomInput
          value={data.name}
          onChange={(e) => {
            const newValue = e.target.value;
            setData((prev: IForm[]) => {
              const newData = [...prev];
              if (newData[index]) {
                newData[index].name = newValue;
              }
              return newData;
            });
          }}
          onBlur={handleBlur}
          style={{
            height: "54px",
            fontSize: "14px",
            lineHeight: "22px",
            fontWeight: 400,
            color: "#141414",
            paddingRight: "20px",
            paddingLeft: "20px",
            ...(error[index] && {
              borderColor: "#E64A19",
              background: "#FFD8D44D",
            }),
          }}
          placeholder="Enter category name"
        />
        {error[index] && (
          <CustomText stylearr={[12, 18, 400]} color={"#E64A19"}>
            This sub-category name already exists within this category.
          </CustomText>
        )}
      </div>
      <div className="flex flex-col gap-[10px]">
        <CustomText stylearr={[14, 22, 400]}>Link Category </CustomText>
        <CommonDropdownComponent
          title={"Select Category"}
          options={categoryOptions}
          value={data.categoryId}
          onChange={(value) => {
            setData((prev: IForm[]) => {
              const newData = [...prev];
              if (newData[index]) {
                newData[index].categoryId = value;
              }
              return newData;
            });
          }}
          style={{
            fontSize: "14px",
            lineHeight: "22px",
            fontWeight: 400,
            color: "#141414",
            paddingRight: "20px",
            paddingLeft: "20px",
            height: "54px",
          }}
          isResetAble={true}
        />
      </div>
    </div>
  );
};

export default function AddSubCategoryModal({
  categories,
}: {
  categories: ILoanCategory[];
}) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [formData, setFormData] = useState<IForm[]>([
    { name: "", categoryId: "" },
  ]);
  const [error, setError] = useState<boolean[]>([false]);
  const lastFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormData([{ name: "", categoryId: "" }]);
    setError([false]);
  }, [isOpen]);

  useEffect(() => {
    EventBus.getInstance().addListener(
      EVENT_OPEN_ADD_SUBCATEGORY_MODAL,
      onOpen
    );
    return () => EventBus.getInstance().removeListener(onOpen);
  }, []);

  useEffect(() => {
    if (lastFormRef.current) {
      lastFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [formData.length]);

  // Function to check for duplicate subcategory names
  const checkDuplicateNames = (
    name: string,

    currentIndex: number
  ): boolean => {
    if (!name.trim()) return false;

    const normalizedName = name.trim().toLowerCase();

    return formData.some(
      (item, index) =>
        index !== currentIndex &&
        item.name.trim().toLowerCase() === normalizedName
    );
  };

  const { mutate, isLoading } = useAddSubCategory();

  const handleSubmit = () => {
    const payload = formData?.map((item) => ({
      subcategory_type: item?.name
        .trim()
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" "),
      parent_category_id: item?.categoryId,
    }));

    mutate(payload, {
      onSuccess: () => {
        onClose();
      },
      onError(err: any) {
        if (
          err?.response?.data?.status_code === 1048 &&
          err?.response?.data?.detail
        ) {
          const newErrorState = [...error];
          let errorIndex = 0;

          // Handle the case where detail is a string in format "index: 0, name: Test 2"
          if (typeof err?.response?.data?.detail === "string") {
            const match = err.response.data.detail.match(/index:\s*(\d+)/);
            if (match && match[1]) {
              errorIndex = parseInt(match[1], 10);
            }
          } else if (err?.response?.data?.detail?.index >= 0) {
            // Handle the case where detail is an object with index property
            errorIndex = err.response.data.detail.index;
          }

          newErrorState[errorIndex] = true;
          setError(newErrorState);
        }
      },
    });
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col w-[424px] max-h-[560px] overflow-y-auto rounded-[8px] p-4 gap-4 bg-white">
        <div className="flex flex-row justify-between">
          <CustomText stylearr={[20, 28, 500]} color={"#101828"}>
            Add Sub-Category
          </CustomText>
          <RemoveThin
            fontSize={"28px"}
            className="cursor-pointer"
            onClick={onClose}
          />
        </div>
        <div
          className={`flex flex-col gap-4 h-full overflow-y-auto ${styles.thinScrollbar}`}
        >
          {formData.map((item, index) => (
            <React.Fragment key={index}>
              <div ref={index === formData.length - 1 ? lastFormRef : null}>
                <Form
                  data={item}
                  index={index}
                  setData={setFormData}
                  categories={categories}
                  error={error}
                  setError={setError}
                  checkDuplicateNames={checkDuplicateNames}
                />
              </div>
              {index !== formData.length - 1 && <Divider />}
            </React.Fragment>
          ))}
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
            isDisabled={
              formData?.some((item) => !item.name.trim() || !item.categoryId) ||
              error?.some((er) => er)
            }
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
