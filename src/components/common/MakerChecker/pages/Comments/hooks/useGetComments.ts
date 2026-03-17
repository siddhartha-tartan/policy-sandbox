import { useState } from "react";
import { MOCK_COMMENTS } from "../../../../../../mock/mockData";

export interface IComment {
  id: string;
  request_id: string;
  user_details: {
    userid: string;
    name: string;
    employee_id: string;
    role: string;
  };
  comment: string;
  created_at: string;
  level: number;
}

export const getCommentsKey = `/approvals/comments/:requestId`;

export default function useGetComments(request_id?: string) {
  const [comments] = useState<IComment[]>(
    request_id
      ? MOCK_COMMENTS.filter((c) => c.request_id === request_id).map((c) => ({
          id: c.id,
          request_id: c.request_id,
          user_details: {
            userid: c.created_by,
            name: c.created_by_name,
            employee_id: "EMP-001",
            role: "SPOC",
          },
          comment: c.comment,
          created_at: c.created_at,
          level: 1,
        }))
      : []
  );

  return {
    data: comments,
    isLoading: false,
  };
}
