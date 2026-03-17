import { useEffect, useState } from "react";
import { MOCK_USERS } from "../../../../mock/mockData";
import { UserType } from "../../../../utils/constants/constants";

export interface IUserCategoryAccess {
  access_type: "view" | "edit" | null;
  loan_category_id: string;
  loan_category_name?: string;
}

export interface IUser {
  id: string;
  source_employee_id: string;
  first_name: string;
  email: string;
  phone_number: string;
  user_type: UserType;
  designation: string;
  is_active: boolean;
  _metadata: string;
  loan_category_access: IUserCategoryAccess[] | null;
  feature_ids: string[];
  query_permission?: boolean;
  created_at: string;
  updated_at: string;
}

export interface IUserData {
  current_page: number;
  total_pages: number;
  page_size: number;
  data: IUser[];
  user_count: number;
}

export const getUsersKey = `/users`;

export default function useGetUsers() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [status, setStatus] = useState<Set<boolean>>(new Set());
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);
  const [users, setUsers] = useState<IUserData | null>(null);
  const [aiAccess, setAiAccess] = useState<Set<string>>(new Set());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [roles, setRoles] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    let filtered = MOCK_USERS.map((u) => ({
      id: u.id,
      source_employee_id: u.source_employee_id,
      first_name: `${u.first_name} ${u.last_name}`,
      email: u.email,
      phone_number: u.phone_number,
      user_type: u.user_type,
      designation: "",
      is_active: !u.is_disabled,
      _metadata: "{}",
      loan_category_access: u.category_ids.map((catId) => ({
        access_type: "edit" as const,
        loan_category_id: catId,
      })),
      feature_ids: u.features.map((f) => f.name),
      query_permission: false,
      created_at: u.created_at,
      updated_at: u.created_at,
    }));

    if (searchQuery) {
      filtered = filtered.filter(
        (u) =>
          u.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (status.size > 0) {
      filtered = filtered.filter((u) => status.has(u.is_active));
    }
    if (roles.size > 0) {
      filtered = filtered.filter((u) => roles.has(u.user_type));
    }

    const startIdx = (page - 1) * pageSize;
    const paged = filtered.slice(startIdx, startIdx + pageSize);

    setUsers({
      current_page: page,
      total_pages: Math.ceil(filtered.length / pageSize) || 1,
      page_size: pageSize,
      data: paged,
      user_count: filtered.length,
    });
  }, [searchQuery, page, pageSize, status.size, aiAccess.size, roles.size, categories.size, startDate, endDate]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, startDate, endDate, aiAccess.size, status.size, roles.size, categories.size]);

  return {
    data: users,
    isLoading: false,
    searchQuery,
    setSearchQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    page,
    setPage,
    pageSize,
    setPageSize,
    aiAccess,
    setAiAccess,
    roles,
    setRoles,
    categories,
    setCategories,
  };
}
