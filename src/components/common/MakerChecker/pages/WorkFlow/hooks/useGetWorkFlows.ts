import { useEffect, useState } from "react";
import { MOCK_WORKFLOWS } from "../../../../../../mock/mockData";
import { IWorkFlowLevel } from "./useAddWorkFlow";

export interface IWorkFlow {
  id: string;
  domain_id: string;
  domain_name: string;
  modules: { module_id: string; module_name: string; module_code: string }[];
  name: string;
  is_active: boolean;
  levels_count: number;
  user_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  config: {
    entity_types: string[];
    levels: IWorkFlowLevel[];
  };
}

export const getWorkFlowsKey = `/workflows`;

export default function useGetWorkFlows() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [workFlows, setWorkFlows] = useState<IWorkFlow[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    let filtered = MOCK_WORKFLOWS.map((wf) => ({
      id: wf.id,
      domain_id: "dom-001",
      domain_name: "Policy Portal",
      modules: [{ module_id: wf.module_id, module_name: wf.module_name, module_code: wf.module_name.toLowerCase().replace(" ", "_") }],
      name: wf.name,
      is_active: wf.status === "active",
      levels_count: wf.levels.length,
      user_count: wf.levels.reduce((sum, l) => sum + l.user_ids.length, 0),
      created_at: wf.created_at,
      updated_at: wf.updated_at,
      created_by: "mock-user-001",
      updated_by: "mock-user-001",
      config: {
        entity_types: wf.entity_types,
        levels: wf.levels.map((l) => ({
          level_number: l.level,
          approval_type: "ALL",
          required_approvals: l.user_ids.length,
          users: l.users.map((u) => ({
            user_id: u.id,
            name: u.name,
            employee_id: "EMP-001",
            role: l.user_type,
          })),
        })),
      },
    }));

    if (searchQuery) {
      filtered = filtered.filter((wf) =>
        wf.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setWorkFlows(filtered);
    setTotalPages(1);
    setTotalCount(filtered.length);
  }, [searchQuery, pageSize, pageNumber, category, status, fromDate, toDate]);

  useEffect(() => {
    setPageNumber(1);
  }, [searchQuery, pageSize, category, status, fromDate, toDate]);

  return {
    data: workFlows,
    isLoading: false,
    searchQuery,
    setSearchQuery,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    totalPages,
    status,
    setStatus,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    category,
    setCategory,
    totalCount,
  };
}
