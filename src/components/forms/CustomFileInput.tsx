import { Flex } from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import UploadCloud from "../../assets/Icons/UploadCloud";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";
import { InputFieldsProps } from "./utils/data";

const CustomFileInput = (props: InputFieldsProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const handleOnChange = useCallback(
    (value: File | null) => {
      if (props.disabled) return;
      props.onInput({ value, inputKey: props.inputKey });
    },
    [props.disabled]
  );
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    if (props.disabled) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (props.disabled) return;
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (props.disabled) return;
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (allowedTypes.includes(files[0].type)) {
        handleOnChange(files[0]);
      }
    }
  };

  if (props.value) {
    return (
      <div
        className={`flex flex-row gap-[81px] justify-between p-4 border bg-white rounded-[8px] justify-between items-center ${
          props.disabled ? "opacity-70" : ""
        }`}
        style={{ minHeight: "83px" }}
      >
        <div className="flex flex-row gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13 2.01558C13 1.98928 13 1.97612 12.9989 1.95227C12.9753 1.4585 12.541 1.02448 12.0473 1.00112C12.0234 0.999992 12.0156 0.999995 12 1H8.75866C7.95372 0.99999 7.28935 0.999981 6.74818 1.0442C6.18608 1.09012 5.66938 1.18869 5.18404 1.43598C4.43139 1.81947 3.81947 2.43139 3.43598 3.18404C3.18869 3.66938 3.09012 4.18608 3.0442 4.74818C2.99998 5.28936 2.99999 5.95372 3 6.75867V17.2413C2.99999 18.0463 2.99998 18.7106 3.0442 19.2518C3.09012 19.8139 3.18869 20.3306 3.43598 20.816C3.81947 21.5686 4.43139 22.1805 5.18404 22.564C5.66938 22.8113 6.18608 22.9099 6.74818 22.9558C7.28937 23 7.95372 23 8.75868 23H15.2413C16.0463 23 16.7106 23 17.2518 22.9558C17.8139 22.9099 18.3306 22.8113 18.816 22.564C19.5686 22.1805 20.1805 21.5686 20.564 20.816C20.8113 20.3306 20.9099 19.8139 20.9558 19.2518C21 18.7106 21 18.0463 21 17.2413V9.99994C21 9.98441 21 9.97664 20.9989 9.95282C20.9756 9.45899 20.5415 9.02471 20.0477 9.00115C20.0238 9.00001 20.0107 9.00001 19.9845 9.00001L15.5681 9.00001C15.3157 9.00004 15.0699 9.00007 14.8618 8.98307C14.6332 8.96439 14.3634 8.92032 14.092 8.78202C13.7157 8.59028 13.4097 8.28432 13.218 7.90799C13.0797 7.63657 13.0356 7.36683 13.017 7.13824C12.9999 6.93008 13 6.68429 13 6.43191L13 2.01558ZM8 13C7.44772 13 7 13.4477 7 14C7 14.5523 7.44772 15 8 15H16C16.5523 15 17 14.5523 17 14C17 13.4477 16.5523 13 16 13H8ZM8 17C7.44772 17 7 17.4477 7 18C7 18.5523 7.44772 19 8 19H14C14.5523 19 15 18.5523 15 18C15 17.4477 14.5523 17 14 17H8Z"
              fill="#ACAFBE"
            />
            <path
              d="M18.908 6.99999C19.2016 7 19.3484 7 19.4686 6.92627C19.6385 6.82215 19.74 6.57684 19.6935 6.38313C19.6605 6.24598 19.5648 6.15033 19.3733 5.95904L16.041 2.62672C15.8497 2.43523 15.754 2.33949 15.6169 2.30652C15.4232 2.25996 15.1779 2.3615 15.0737 2.53134C15 2.65161 15 2.79842 15 3.09204L15 6.19996C15 6.47998 15 6.61999 15.0545 6.72694C15.1024 6.82102 15.1789 6.89751 15.273 6.94545C15.38 6.99995 15.52 6.99995 15.8 6.99995L18.908 6.99999Z"
              fill="#ACAFBE"
            />
          </svg>
          <div className="flex flex-col">
            <CustomText stylearr={[12, 18, 500]}>
              {props.value?.name || props.value?.file_name}
            </CustomText>
          </div>
        </div>
        {!props.disabled && (
          <div className="cursor-pointer" onClick={() => handleOnChange(null)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M6 2H10M2 4H14M12.6667 4L12.1991 11.0129C12.129 12.065 12.0939 12.5911 11.8667 12.99C11.6666 13.3412 11.3648 13.6235 11.0011 13.7998C10.588 14 10.0607 14 9.00623 14H6.99377C5.93927 14 5.41202 14 4.99889 13.7998C4.63517 13.6235 4.33339 13.3412 4.13332 12.99C3.90607 12.5911 3.871 12.065 3.80086 11.0129L3.33333 4M6.66667 7V10.3333M9.33333 7V10.3333"
                stroke="#ACAFBE"
                stroke-width="1.3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    );
  }

  return (
    <label style={{ cursor: props.disabled ? "not-allowed" : "pointer" }}>
      <input
        type="file"
        ref={(ref) => (fileRef.current = ref)}
        accept={".doc,.docx,.pdf"}
        style={{ display: "none" }}
        disabled={props.disabled}
        onChange={(e) => {
          if (props.disabled) return;
          const files = e.target.files;
          if (files && files.length > 0) {
            const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            if (allowedTypes.includes(files?.[0]?.type)) {
              handleOnChange(files[0]);
            }
          }
        }}
      />
      <Flex
        p={4}
        justifyContent={"space-between"}
        alignItems={"center"}
        borderRadius={"8px"}
        cursor={props.disabled ? "not-allowed" : "pointer"}
        border={`1px dotted ${systemColors.ash[30]}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        bg={isDragging ? "gray.50" : "transparent"}
        transition="background-color 0.2s ease"
        minHeight="83px"
        gap={4}
        opacity={props.disabled ? 0.7 : 1}
      >
        <Flex flexDir={"row"} gap={3}>
          <UploadCloud />
          <Flex flexDirection={"column"}>
            <CustomText stylearr={[14, 21, 500]} color={"#353535"}>
              {props.label}
            </CustomText>
            <CustomText stylearr={[12, 18, 400]} color={"#A2A4AC"}>
              {props?.placeholder ||
                "Drag and drop your file here or click to browse"}
            </CustomText>
          </Flex>
        </Flex>

        <div
          className="flex text-sm rounded-[8px] bg-white items-center justify-center w-[107px] h-[41px]"
          style={{
            boxShadow:
              " 0px 1px 1px 0px rgba(18, 18, 18, 0.10), 0px 0px 0px 1px rgba(18, 18, 18, 0.07), 0px 1px 3px 0px rgba(18, 18, 18, 0.10)",
            opacity: props.disabled ? 0.7 : 1,
          }}
        >
          Browse Files
        </div>
      </Flex>
    </label>
  );
};

export default CustomFileInput;
