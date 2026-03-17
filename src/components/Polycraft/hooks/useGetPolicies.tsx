import { useEffect, useState } from "react";
import { MOCK_POLICIES } from "../../../mock/mockData";
import { userStore } from "../../../store/userStore";

export interface PolicyFile {
  id: string;
  file_name: string;
  status: "Successful" | "Processing" | "Failed";
  version: number;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface Policy {
  id: string;
  loan_category_id: string;
  loan_category_name: string;
  subcategory_id?: string;
  subcategory_name?: string;
  status:
    | "active"
    | "deactivated"
    | "drafted"
    | "deleted"
    | "rejected"
    | "approved"
    | "In-Review";
  is_active: boolean;
  validity: string;
  policy_name: string;
  description: string;
  policy_files: PolicyFile[];
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface PolicyData {
  current_page: number;
  total_pages: number;
  page_size: number;
  data: Policy[];
  policy_count: number;
}

export interface PolicyResponse {
  status_code: number;
  message: string;
  data: PolicyData;
}

export const getPoliciesKey = `/policy`;

function buildMockPolicies(): Policy[] {
  return MOCK_POLICIES.map((p) => ({
    id: p.id,
    loan_category_id: p.category_id,
    loan_category_name: p.category_type,
    subcategory_id: "",
    subcategory_name: "",
    status: p.status as Policy["status"],
    is_active: p.status === "approved",
    validity: "2027-12-31",
    policy_name: p.name,
    description: p.description,
    policy_files: p.versions.map((v, idx) => ({
      id: v.id,
      file_name: p.file_name,
      status: "Successful" as const,
      version: parseFloat(v.version),
      created_by: p.created_by,
      created_at: v.created_at,
      updated_by: p.created_by,
      updated_at: idx === 0 ? p.updated_at : v.created_at,
    })),
    created_by: p.created_by,
    created_at: p.created_at,
    updated_by: p.created_by,
    updated_at: p.updated_at,
  }));
}

export default function useGetPolicies() {
  const { loanCategories: _ } = userStore();
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<Set<string>>(new Set<string>());
  const [search, setSearch] = useState("");
  const [categoryIds, setCategoryIds] = useState<Set<string>>(new Set<string>());
  const [policyManagers, setPolicyManagers] = useState<Set<string>>(new Set<string>());
  const [policies, setPolicies] = useState<PolicyResponse | null>(null);

  useEffect(() => {
    let filtered = buildMockPolicies();

    if (status.size > 0) {
      filtered = filtered.filter((p) => status.has(p.status));
    }
    if (search) {
      filtered = filtered.filter((p) =>
        p.policy_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (categoryIds.size > 0) {
      filtered = filtered.filter((p) => categoryIds.has(p.loan_category_id));
    }

    const startIdx = (page - 1) * pageSize;
    const paged = filtered.slice(startIdx, startIdx + pageSize);

    setPolicies({
      status_code: 200,
      message: "Success",
      data: {
        current_page: page,
        total_pages: Math.ceil(filtered.length / pageSize) || 1,
        page_size: pageSize,
        data: paged,
        policy_count: filtered.length,
      },
    });
  }, [page, pageSize, status.size, search, categoryIds.size, policyManagers.size]);

  useEffect(() => {
    setPage(1);
  }, [pageSize, search, categoryIds.size, policyManagers.size, status.size]);

  return {
    data: policies,
    setPage,
    setPageSize,
    page,
    pageSize,
    categoryIds,
    setCategoryIds,
    policyManagers,
    setPolicyManagers,
    search,
    setSearch,
    status,
    setStatus,
    isLoading: false,
    totalPages: policies?.data?.total_pages || 1,
  };
}
