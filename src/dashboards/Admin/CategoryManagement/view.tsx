import { StackDivider, VStack } from "@chakra-ui/react";
import { Provider } from "jotai";
import { useCallback, useMemo, useState } from "react";
import CommonSearchBar from "../../../components/common/CommonSearchBar";
import PageLayout from "../../../components/common/PageLayout";
import useGetLoanCategories from "../../../hooks/useGetLoanCategories";
import styles from "../CategoryManagement/utils/styles.module.css";
import AddCategoryModal from "./components/AddCategoryModal";
import AddSubCategoryModal from "./components/AddSubCategoryModal";
import CategorySubCategoryBox from "./components/CategorySubCategoryBox";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import EditCategoryModal from "./components/EditCategoryModal";
import Header from "./components/Header";

export default function CategoryManagement() {
  const { data: loanCategories } = useGetLoanCategories();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = useCallback((e: any) => {
    setSearchTerm(e?.toLowerCase());
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return loanCategories;
    return loanCategories?.filter((category) =>
      category?.category_type?.toLowerCase().includes(searchTerm)
    );
  }, [loanCategories, searchTerm]);

  return (
    <Provider>
      <PageLayout>
        <div className="flex flex-col p-6 gap-6 bg-white border border-[#FFF] rounded-[16px] w-full h-full">
          <Header />
          <CommonSearchBar
            maxH={"54px"}
            h={"54px"}
            py={4}
            px={5}
            handleChange={handleSearchChange}
            placeholder={"Search Category"}
          />{" "}
          <div
            className={`flex h-full overflow-y-auto grow border rounded-[16px] custom-scrollbar ${styles.thinScrollbar}`}
          >
            <VStack
              w="full"
              flexDir={"column"}
              alignItems={"initial"}
              divider={<StackDivider borderColor={"rgba(0, 0, 0, 0.08)"} />}
            >
              {filteredCategories?.map((item) => (
                <CategorySubCategoryBox data={item} key={item?.id} />
              ))}
            </VStack>
          </div>
        </div>
        <AddCategoryModal />
        <AddSubCategoryModal categories={loanCategories || []} />
        <EditCategoryModal />
        <DeleteConfirmationModal />
      </PageLayout>
    </Provider>
  );
}
