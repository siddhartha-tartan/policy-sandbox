import { Divider, Flex, Switch } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Pencil } from "react-huge-icons/outline";
import { RiDeleteBin7Line } from "react-icons/ri";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomButton, {
  CustomButtonProps,
} from "../../../DesignSystem/CustomButton";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import { IDeleteFaq } from "../hooks/useDeleteFaq";
import { IResponseFaq } from "../hooks/useGetFaqs";
import { UserActions } from "../utils/data";

const ViewFaq = ({
  index,
  permissions,
  data,
  editIndex,
  setEditIndex,
  onEdit,
  onDelete,
}: {
  permissions: Record<UserActions, boolean>;
  index: number;
  data: IResponseFaq;
  editIndex: number | null;
  setEditIndex: (e: number | null) => void;
  onEdit: (payload: IResponseFaq) => void;
  onDelete: (payload: IDeleteFaq) => void;
}) => {
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

  const switchComponent = useMemo(
    () => (
      <Switch
        size="md"
        colorScheme="green"
        isChecked={data.is_active}
        onChange={() => {
          onEdit({ ...data, is_active: !data.is_active });
        }}
      />
    ),
    [data.is_active]
  );

  return (
    <Flex
      p={"24px"}
      flexDir={"row"}
      gridGap={"32px"}
      bg={systemColors.white.absolute}
      borderRadius={"16px"}
      borderLeftWidth={"4px"}
      borderColor={systemColors.black[900]}
    >
      <Flex flexDir={"column"} gridGap={"16px"} flexGrow={1}>
        <CustomText stylearr={[18, 27, 600]}>{`${index + 1}- ${
          data.query_text
        }`}</CustomText>
        <CustomText stylearr={[14, 22, 500]}>{data.answer_text}</CustomText>
      </Flex>
      {permissions.EDIT && permissions.DELETE && (
        <React.Fragment>
          <Divider
            orientation="vertical"
            borderColor={"#E1E1E3"}
            height={"auto"}
          />
          <Flex flexDir={"column"} gridGap={"20px"} justifyContent={"flex-end"}>
            <CustomButton
              leftIcon={switchComponent}
              {...ctaProps}
              color={data.is_active ? "green" : "#546E7A"}
            >
              {data.is_active ? "Active" : "Not Active"}
            </CustomButton>
            <CustomButton
              leftIcon={<Pencil style={{ fontSize: "24px" }} />}
              isDisabled={editIndex !== null}
              onClick={() => setEditIndex(index)}
              {...ctaProps}
            >
              Edit
            </CustomButton>
            <CustomButton
              leftIcon={
                <RiDeleteBin7Line
                  style={{ width: "22px", height: "22px" }}
                  color={systemColors.black[900]}
                />
              }
              onClick={() => {
                onDelete({ id: data?.id });
              }}
              {...ctaProps}
            >
              Delete
            </CustomButton>
          </Flex>
        </React.Fragment>
      )}
    </Flex>
  );
};

export default ViewFaq;
