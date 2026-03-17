import { ILoanCategory } from "../../hooks/useGetLoanCategories";

export function getLoanCategoryIdByType(
  type: string,
  loanCategories: ILoanCategory[]
): string {
  // Check top-level categories first
  const mainCategory = loanCategories?.find(
    (e) => e.category_type?.toLowerCase() === type?.toLowerCase()
  );
  if (mainCategory?.id) return mainCategory.id;

  // Search through subcategories
  for (const item of loanCategories || []) {
    const subcategory = item?.subcategories?.find(
      (sub) => sub?.category_type?.toLowerCase() === type?.toLowerCase()
    );
    if (subcategory?.id) {
      return item?.id;
    }
  }

  return "";
}

export function getLoanCategoryTypeById(
  id: string,
  loanCategories: ILoanCategory[]
): string {
  // Check if it's a top-level category
  const topLevelCategory = loanCategories?.find((e) => e.id === id);
  if (topLevelCategory) return topLevelCategory?.category_type;

  // Check if it's a subcategory
  for (const category of loanCategories || []) {
    const subcategory = category?.subcategories?.find((sub) => sub?.id === id);
    if (subcategory) {
      return category?.category_type; // Return the parent category type
    }
  }

  return ""; // Return empty string if no match found
}

export function getSubCategoryIdByType(
  type: string,
  loanCategories: ILoanCategory[]
): string {
  // Search through subcategories
  for (const item of loanCategories || []) {
    const subcategory = item?.subcategories?.find(
      (sub) => sub?.category_type?.toLowerCase() === type?.toLowerCase()
    );
    if (subcategory?.id) {
      return subcategory?.id;
    }
  }

  return "";
}

export function getSubCategoryTypeById(
  id: string,
  loanCategories: ILoanCategory[]
): string {
  // Check if it's a subcategory
  for (const category of loanCategories || []) {
    const subcategory = category?.subcategories?.find((sub) => sub?.id === id);
    if (subcategory) {
      return subcategory?.category_type; // Return the parent category type
    }
  }

  return ""; // Return empty string if no match found
}

export function getLoanCategoryIdBySubCategoryId(
  id: string,
  loanCategories: ILoanCategory[]
): string {
  // Check if it's a top-level category id (in which case return the id itself)
  const isTopLevelCategory = loanCategories?.some(
    (category) => category?.id === id
  );
  if (isTopLevelCategory) return id;

  // If it's a subcategory id, find its parent category id
  for (const category of loanCategories || []) {
    const hasSubcategory = category?.subcategories?.some(
      (sub) => sub?.id === id
    );
    if (hasSubcategory) {
      return category?.id || "";
    }
  }

  return ""; // Return empty string if no match found
}
