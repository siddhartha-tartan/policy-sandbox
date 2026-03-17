import { chakra, Divider, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { HiCheck } from "react-icons/hi2";
import { RxCross1 } from "react-icons/rx";
import { ILoanCategory } from "../../../../hooks/useGetLoanCategories";
import { userStore } from "../../../../store/userStore";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomButton, {
  CustomButtonProps,
} from "../../../DesignSystem/CustomButton";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import CustomInput from "../../CustomInput";
import CustomTextarea from "../../CustomTextarea";
import { IAddFaq } from "../hooks/useAddFaq";
import { IResponseFaq } from "../hooks/useGetFaqs";
import SelectProductCategoryDropdown from "./SelectProductCategoryDropdown";

const initialValue: IAddFaq = {
  query_text: "",
  answer_text: "",
  category_id: "",
};

const EditFaq = ({
  data = null,
  onCancel,
  onAdd,
  onEdit,
}: {
  data?: IResponseFaq | null;
  onCancel: () => void;
  onAdd: (payload: IAddFaq) => void;
  onEdit: (payload: IResponseFaq) => void;
}) => {
  const [payload, setPayload] = useState<IResponseFaq | IAddFaq>(
    data || initialValue
  );
  const { loanCategories } = userStore();

  const ctaProps: CustomButtonProps = {
    variant: "secondary",
    h: "40px",
    w: "220px",
    px: "24px",
    fontSize: "14px",
    lineHeight: "22px",
    fontWeight: 500,
    justifyContent: "flex-start",
    gridGap: "12px",
    color: systemColors.grey[900],
  };

  const getLabel =
    loanCategories?.filter((row) => row.id === payload?.category_id)?.[0]
      ?.category_type || "";

  const handleSubmit = () => {
    if ((payload as IResponseFaq).id !== undefined) {
      onEdit(payload as IResponseFaq);
    } else {
      onAdd(payload as IAddFaq);
    }
  };

  return (
    <Flex
      p={"24px"}
      flexDir={"row"}
      gridGap={"24px"}
      bg={systemColors.white.absolute}
      borderRadius={"16px"}
      borderLeftWidth={"4px"}
      borderColor={systemColors.black[900]}
    >
      <Flex flexDir={"column"} gridGap={"24px"} flexGrow={1}>
        <Flex flexDir={"column"} gridGap={"10px"}>
          <CustomText stylearr={[14, 22, 500]}>
            Enter Question
            <chakra.span color={systemColors.error[700]}>*</chakra.span>
          </CustomText>
          <CustomInput
            placeholder="Enter Question"
            value={payload?.query_text || ""}
            onChange={(e) => {
              const val = e.target.value.trimStart();
              setPayload((prev) => ({
                ...prev,
                query_text: val,
              }));
            }}
          />
        </Flex>
        <Flex flexDir={"column"} gridGap={"10px"}>
          <CustomText stylearr={[14, 22, 500]}>
            Enter Answer
            <chakra.span color={systemColors.error[700]}>*</chakra.span>
          </CustomText>
          <CustomTextarea
            placeholder="Enter Answer"
            value={payload?.answer_text}
            onChange={(e) => {
              const val = e.target.value.trimStart();
              setPayload((prev) => ({
                ...prev,
                answer_text: val,
              }));
            }}
          />
        </Flex>
      </Flex>

      <Divider orientation="vertical" borderColor={"#E1E1E3"} height={"auto"} />
      <Flex flexDir={"column"} gridGap={"20px"} justifyContent={"center"}>
        {/* <Menu matchWidth={true}>
          <MenuButton
            p={"16px 20px"}
            alignItems="center"
            border={`1px solid ${customColors.GREEN_WHITE}`}
            gridGap={"16px"}
            borderRadius={"10px"}
            bgColor={systemColors.white.absolute}
            as={Button}
            rightIcon={<ChevronDownIcon />}
            transition="all 0.2s"
            w={"220px"}
            h={"40px"}
            fontSize={"14px"}
            lineHeight={"22px"}
            fontWeight={500}
            justifyContent={"flex-start"}
          >
            {getLabel || "Select Product Category"}
          </MenuButton>
          <MenuList maxH={"300px"} overflowY={"auto"}>
            {loanCategories?.map((item, id) => {
              return (
                <MenuItem
                  key={id}
                  onClick={() => {
                    setPayload((prev) => ({
                      ...prev,
                      category_id: item.id,
                    }));
                  }}
                  _active={{
                    bgColor: "none",
                  }}
                  _focus={{
                    bgColor: "none",
                    outline: "none",
                  }}
                  _hover={{
                    bgColor: "none",
                    outline: "none",
                  }}
                >
                  <CustomText
                    stylearr={[14, 22, 500]}
                    color={systemColors.primary}
                  >
                    {item.category_type}
                  </CustomText>
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu> */}
        <SelectProductCategoryDropdown
          onClick={(item: ILoanCategory) => {
            setPayload((prev) => ({
              ...prev,
              category_id: item.id,
            }));
          }}
          getLabel={getLabel}
        />
        <CustomButton
          isDisabled={
            !payload?.answer_text ||
            !payload?.category_id ||
            !payload?.query_text
          }
          leftIcon={
            <HiCheck
              style={{
                width: "20px",
                height: "20px",
                color: systemColors.black[900],
              }}
            />
          }
          onClick={handleSubmit}
          {...ctaProps}
        >
          Save
        </CustomButton>
        <CustomButton
          onClick={onCancel}
          {...ctaProps}
          leftIcon={
            <RxCross1
              style={{
                width: "16px",
                height: "16px",
                color: systemColors.black[900],
              }}
            />
          }
        >
          Cancel
        </CustomButton>
      </Flex>
    </Flex>
  );
};
export default EditFaq;
