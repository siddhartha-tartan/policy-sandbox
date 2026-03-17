import { useEffect } from "react";
import { MOCK_LOAN_CATEGORIES } from "../mock/mockData";
import { userStore } from "../store/userStore";
import { UserType } from "../utils/constants/constants";

export interface ISubCategory {
  id: string;
  category_type: string;
  is_disabled: boolean;
  is_active: boolean;
}

export interface ILoanCategory {
  category_type: string;
  id: string;
  is_active: boolean;
  is_disabled: boolean;
  policy: { count: number };
  access_type: "edit" | "view" | null;
  subcategories: ISubCategory[];
}

export const getLoanCategoriesEndpoint = "/category/current-user";
export const getLoanCategoryKey = "get-loan-categories";

export default function useGetLoanCategories() {
  const { userType, setLoanCategories, setEditableLoanCategories } = userStore();

  useEffect(() => {
    const activeCategories = MOCK_LOAN_CATEGORIES.filter(
      (c) => c.is_active && !c.is_disabled
    ).map((c) => ({
      ...c,
      subcategories: c.subcategories.filter((s) => s.is_active && !s.is_disabled),
    }));

    if (userType === UserType.SPOC) {
      setEditableLoanCategories(activeCategories.filter((item) => item.access_type === "edit"));
    } else {
      setEditableLoanCategories(activeCategories);
    }
    setLoanCategories(activeCategories);
  }, [userType]);

  return { data: MOCK_LOAN_CATEGORIES, isLoading: false };
}
