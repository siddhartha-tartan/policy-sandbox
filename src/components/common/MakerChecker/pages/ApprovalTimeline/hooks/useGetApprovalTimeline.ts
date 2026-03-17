import { useState } from "react";
import {
  MOCK_POLICY_CHANGES,
  type PolicyChange,
} from "../../../../../../mock/mockData";

export interface IApprovalUser {
  user_id: string;
  user_name: string;
  action_type: string;
  timestamp: string;
  comment: string;
  role: string;
  employee_id: string;
}

export interface IApprovalTimeline {
  request_id: string;
  entity_name: string;
  entity_type: string;
  entity_data: {
    file_id: string;
    version: number;
    policy_id: string;
    event_type: string;
    category_id: string;
    policy_name: string;
    change_type: "new_upload" | "version_upload" | "inline_edit";
    original_html?: string;
    modified_html?: string;
  };
  changes: PolicyChange[];
  priority: string;
  created_at: string;
  current_level: number;
  total_levels: number;
  maker: {
    user_name: string;
    user_id: string;
    role: string;
    employee_id: string;
  };
  workflow_timeline: {
    level: number;
    level_name: string;
    status: string;
    start_time: string;
    completion_time: string;
    approvers: IApprovalUser[];
  }[];
}

export const getApprovalTimelineKey = `/approvals/:requestId/timeline`;

const MOCK_TIMELINES: Record<string, IApprovalTimeline> = {
  "apr-001": {
    request_id: "apr-001",
    entity_name: "Personal Loan Interest Rate Policy",
    entity_type: "policy",
    entity_data: {
      file_id: "file-002",
      version: 2,
      policy_id: "pol-002",
      event_type: "update",
      category_id: "cat-002",
      policy_name: "Personal Loan Interest Rate Policy",
      change_type: "version_upload",
    },
    changes: MOCK_POLICY_CHANGES["apr-001"] || [],
    priority: "high",
    created_at: "2026-02-10T11:30:00Z",
    current_level: 1,
    total_levels: 2,
    maker: {
      user_name: "Sandbox User",
      user_id: "mock-user-001",
      role: "SPOC",
      employee_id: "EMP-001",
    },
    workflow_timeline: [
      {
        level: 1,
        level_name: "Level 1 - SPOC Review",
        status: "completed",
        start_time: "2026-02-10T11:30:00Z",
        completion_time: "2026-02-11T14:00:00Z",
        approvers: [
          {
            user_id: "mock-user-001",
            user_name: "Sandbox User",
            action_type: "APPROVE",
            timestamp: "2026-02-11T14:00:00Z",
            comment: "Looks good",
            role: "SPOC",
            employee_id: "EMP-001",
          },
        ],
      },
      {
        level: 2,
        level_name: "Level 2 - Admin Review",
        status: "pending",
        start_time: "2026-02-11T14:00:00Z",
        completion_time: "",
        approvers: [],
      },
    ],
  },
  "apr-002": {
    request_id: "apr-002",
    entity_name: "Vehicle Loan Documentation Policy",
    entity_type: "policy",
    entity_data: {
      file_id: "file-003",
      version: 1,
      policy_id: "pol-003",
      event_type: "NEW_REQUEST",
      category_id: "cat-003",
      policy_name: "Vehicle Loan Documentation Policy",
      change_type: "new_upload",
    },
    changes: MOCK_POLICY_CHANGES["apr-002"] || [],
    priority: "medium",
    created_at: "2026-02-20T08:00:00Z",
    current_level: 1,
    total_levels: 2,
    maker: {
      user_name: "Sandbox User",
      user_id: "mock-user-001",
      role: "SPOC",
      employee_id: "EMP-001",
    },
    workflow_timeline: [
      {
        level: 1,
        level_name: "Level 1 - SPOC Review",
        status: "pending",
        start_time: "2026-02-20T08:00:00Z",
        completion_time: "",
        approvers: [],
      },
      {
        level: 2,
        level_name: "Level 2 - Admin Review",
        status: "pending",
        start_time: "",
        completion_time: "",
        approvers: [],
      },
    ],
  },
};

export default function useGetApprovalTimeline(requestId?: string) {
  const [approval] = useState<IApprovalTimeline | null>(
    requestId && MOCK_TIMELINES[requestId]
      ? MOCK_TIMELINES[requestId]
      : null
  );

  return {
    data: approval,
    isLoading: false,
  };
}
