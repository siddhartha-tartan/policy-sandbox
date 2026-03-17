import { useEffect, useState } from "react";
import { MOCK_POLICIES, MOCK_LOAN_CATEGORIES } from "../../../mock/mockData";

export interface PolicyByCategories {
  category_id: string;
  category_name: string;
  policies: {
    id: string;
    policy_name: string;
    files: {
      id: string;
      version: number;
      status: "Successful" | "Processing" | "Failed";
    }[];
  }[];
}

export const getPoliciesByCategoriesKey = `/category-policy-groups`;

export default function useGetPoliciesByCategories() {
  const [search, setSearch] = useState("");
  const [categoryIds, setCategoryIds] = useState<Set<string>>(new Set<string>());
  const [policies, setPolicies] = useState<PolicyByCategories[]>([]);

  useEffect(() => {
    const grouped = MOCK_LOAN_CATEGORIES.map((cat) => {
      const catPolicies = MOCK_POLICIES.filter((p) => p.category_id === cat.id);
      const filteredPolicies = search
        ? catPolicies.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          )
        : catPolicies;

      return {
        category_id: cat.id,
        category_name: cat.category_type,
        policies: filteredPolicies.map((p) => ({
          id: p.id,
          policy_name: p.name,
          files: [
            {
              id: p.file_id,
              version: parseFloat(p.version),
              status: "Successful" as const,
            },
          ],
        })),
      };
    });

    let result = grouped.filter((g) => g.policies.length > 0);
    if (categoryIds.size > 0) {
      result = result.filter((g) => categoryIds.has(g.category_id));
    }
    setPolicies(result);
  }, [search, categoryIds.size]);

  return {
    data: policies,
    categoryIds,
    setCategoryIds,
    search,
    setSearch,
    isLoading: false,
  };
}
