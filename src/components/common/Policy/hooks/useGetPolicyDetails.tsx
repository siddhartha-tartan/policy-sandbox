import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MOCK_POLICIES } from "../../../../mock/mockData";

export interface PolicyDetails {
  name: string;
  description: string;
  pdf_url: string;
  loan_category: string;
  owner: string;
  published_on: number;
  loan_category_id: string;
  request_id: string;
  priority: string;
  comment?: string;
  subcategory_id?: string;
  file_name: string;
  validity: string;
  policy_status: string;
}

export interface VersionHistoryItem {
  name: string;
  owner: string;
  updated_at: number;
  modified_by: string;
  size: string;
  version: string;
  id: string;
  status: "Successful" | "Processing" | "Failed";
}

export const initPolicyDetails: PolicyDetails = {
  name: "",
  description: "",
  pdf_url: "",
  loan_category: "",
  owner: "",
  published_on: new Date().getTime(),
  loan_category_id: "",
  subcategory_id: "",
  file_name: "",
  validity: "",
  request_id: "",
  priority: "",
  comment: "",
  policy_status: "",
};

export const getPolicyDetails = "/category/:category_id/policy/:policy_id";

export default function useGetPolicyDetails(
  categoyIdProp = "",
  policyIdProp = ""
) {
  const { id, categoryId } = useParams<{ id: string; categoryId: string }>();
  const [policyData, setPolicyData] = useState<PolicyDetails | null>(null);
  const [versionData, setVersionData] = useState<VersionHistoryItem[]>([]);

  const targetPolicyId = policyIdProp || id;
  const targetCategoryId = categoyIdProp || categoryId;

  useEffect(() => {
    if (!targetPolicyId) return;

    const mockPolicy = MOCK_POLICIES.find((p) => p.id === targetPolicyId);
    if (mockPolicy) {
      setPolicyData({
        name: mockPolicy.name,
        description: mockPolicy.description,
        pdf_url: mockPolicy.file_id,
        loan_category: mockPolicy.category_type,
        owner: mockPolicy.created_by,
        published_on: new Date(mockPolicy.created_at).getTime(),
        loan_category_id: mockPolicy.category_id,
        subcategory_id: "",
        file_name: mockPolicy.file_name,
        validity: "2027-12-31",
        request_id: `req-${mockPolicy.id}`,
        priority: "high",
        comment: "",
        policy_status: mockPolicy.status,
      });

      setVersionData(
        mockPolicy.versions.map((v, idx) => ({
          name: mockPolicy.file_name,
          owner: mockPolicy.created_by,
          updated_at: new Date(v.created_at).getTime(),
          modified_by: mockPolicy.created_by,
          size: "1 mb",
          version: `V${mockPolicy.versions.length - idx}`,
          id: v.id,
          status: "Successful" as const,
        }))
      );
    }
  }, [targetPolicyId, targetCategoryId]);

  return {
    data: policyData,
    isLoading: false,
    versionData,
  };
}
