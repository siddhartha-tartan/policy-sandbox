import { useEffect, useState } from "react";
import { MOCK_APPROVAL_REQUESTS } from "../../../../../../mock/mockData";
import { userStore } from "../../../../../../store/userStore";

export interface IApprovalRequest {
  request_id: string;
  workflow_id: string;
  domain_id: string;
  domain_name: string;
  workflow_name: string;
  entity_type: string;
  entity_id: string;
  maker_name: string;
  entity_data: {
    file_id: string;
    version: number;
    policy_id: string;
    event_type: string;
    category_id: string;
    policy_name: string;
  };
  current_level: number;
  total_levels: number;
  status: string;
  priority: string;
  created_by: string;
  creater_name: string;
  created_at: string;
  updated_at: string;
}

interface IResponse {
  approvals: IApprovalRequest[];
  pagination: {
    total_items: number;
    total_pages: number;
    current_page: number;
    size: number;
  };
}

export const getApprovalRequestsKey = `/approvals/:status`;

export default function useGetApprovalRequests(status: "all" | "pending") {
  const { id: _userId } = userStore();
  const [approvals, setApprovals] = useState<IResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [priority, setPriority] = useState<string>("");
  const [requestedBy, setRequestedBy] = useState<string>("");

  useEffect(() => {
    const raw = status === "pending"
      ? MOCK_APPROVAL_REQUESTS.pending
      : MOCK_APPROVAL_REQUESTS.all;

    let filtered = raw.map((r) => ({
      request_id: r.request_id,
      workflow_id: "wf-001",
      domain_id: "dom-001",
      domain_name: "Policy Portal",
      workflow_name: "Policy Approval Workflow",
      entity_type: r.entity_type,
      entity_id: r.entity_id,
      maker_name: r.maker_name,
      entity_data: {
        file_id: "file-001",
        version: 1,
        policy_id: r.entity_id,
        event_type: r.action,
        category_id: "cat-001",
        policy_name: r.entity_name,
      },
      current_level: 1,
      total_levels: 2,
      status: r.status,
      priority: "high",
      created_by: r.maker_id,
      creater_name: r.maker_name,
      created_at: r.created_at,
      updated_at: r.created_at,
    }));

    if (searchQuery) {
      filtered = filtered.filter((a) =>
        a.entity_data.policy_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setApprovals({
      approvals: filtered,
      pagination: {
        total_items: filtered.length,
        total_pages: 1,
        current_page: 1,
        size: pageSize,
      },
    });
    setTotalPages(1);
    setTotalCount(filtered.length);
  }, [status, searchQuery, pageSize, pageNumber, priority, requestedBy]);

  useEffect(() => {
    setPageNumber(1);
  }, [searchQuery, pageSize, priority, requestedBy]);

  return {
    data: approvals,
    isLoading: false,
    searchQuery,
    setSearchQuery,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    totalPages,
    priority,
    setPriority,
    requestedBy,
    setRequestedBy,
    totalCount,
  };
}
