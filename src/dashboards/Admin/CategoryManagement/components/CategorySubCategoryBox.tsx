import { Box, Flex, HStack, Switch, VStack } from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import { Pencil, RemoveThin } from "react-huge-icons/outline";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";
import EventBus from "../../../../EventBus";
import {
  ILoanCategory,
  ISubCategory,
} from "../../../../hooks/useGetLoanCategories";
import useUpdateCategory from "../../../../hooks/useUpdateCategory";
import { selectedCategoryAtom } from "../utils/atom";
import { EVENT_OPEN_EDIT_CATEGORY_MODAL } from "./EditCategoryModal";
import { EVENT_OPEN_DELETE_CONFIRMATION_MODAL } from "./DeleteConfirmationModal";

export default function CategorySubCategoryBox({
  data,
}: {
  data: ILoanCategory;
}) {
  const setCategory = useSetAtom(selectedCategoryAtom);
  const { mutate, isLoading } = useUpdateCategory();
  const activeSubCategories = data?.subcategories?.filter(
    (sub) => !sub?.is_disabled
  );

  const handleRemoveSubCategory = (sub: ISubCategory) => {
    mutate({
      id: data?.id,
      category_type: data?.category_type,
      subcategories: data?.subcategories?.map((item) => {
        if (item.id === sub.id) {
          return { ...item, is_disabled: true };
        } else {
          return item;
        }
      }),
      is_disabled: false,
    });
  };

  return (
    <Flex justifyContent="space-between" px="6" py="4" gap="8">
      <VStack align="flex-start" spacing={10}>
        <HStack spacing="4">
          <CustomText
            stylearr={[14, 20, 700]}
            minW="140px"
            w="140px"
            isTruncated
            color="#607D8B"
          >
            Category Name
          </CustomText>
          <CustomText stylearr={[14, 20, 500]} color="#607D8B">
            {data?.category_type}
          </CustomText>
        </HStack>
        {activeSubCategories?.length > 0 && (
          <HStack spacing="4" alignItems="flex-start">
            <CustomText
              stylearr={[14, 20, 700]}
              minW="140px"
              w="140px"
              isTruncated
              color="#607D8B"
            >
              Sub-Categories
            </CustomText>
            <Flex gap="6" flexWrap="wrap" alignItems="center">
              {activeSubCategories.map((item) => (
                <Box
                  key={item.id}
                  display="flex"
                  gap="10px"
                  py="1"
                  px="2"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="8px"
                  color="#607D8B"
                  cursor={isLoading ? "not-allowed" : "pointer"}
                  onClick={() => {
                    isLoading ? {} : handleRemoveSubCategory(item);
                  }}
                  background="var(--Policy-Portal-gradient-light-blue, linear-gradient(231deg, rgba(55, 98, 221, 0.00) 13.46%, rgba(55, 98, 221, 0.20) 194.11%)"
                >
                  <CustomText stylearr={[13, 18, 500]}>
                    {item.category_type}
                  </CustomText>
                  <RemoveThin fontSize="18px" cursor="pointer" />
                </Box>
              ))}
            </Flex>
          </HStack>
        )}
      </VStack>
      <HStack spacing="4">
        <Flex
          bgColor="#2F78EE"
          justifyContent="center"
          alignItems="center"
          w="30px"
          h="30px"
          borderRadius="8px"
          cursor="pointer"
          onClick={() => {
            setCategory(data);
            EventBus.getInstance().fireEvent(EVENT_OPEN_EDIT_CATEGORY_MODAL);
          }}
        >
          <Pencil style={{ fontSize: "16px" }} color="#fff" />
        </Flex>
        <Switch
          mt="1"
          colorScheme="blue"
          sx={{
            "& .chakra-switch__track[data-checked]": {
              backgroundColor: "#2F78EE",
            },
          }}
          isChecked={!data?.is_disabled}
          isDisabled={isLoading}
          onChange={() => {
            if (data?.is_disabled) {
              mutate({
                id: data?.id!,
                category_type: data?.category_type!,
                subcategories: data?.subcategories!,
                is_disabled: false,
              });
            } else {
              setCategory(data);
              EventBus.getInstance().fireEvent(
                EVENT_OPEN_DELETE_CONFIRMATION_MODAL
              );
            }
          }}
        />
      </HStack>
    </Flex>
  );
}
