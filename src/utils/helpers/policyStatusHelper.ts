import {
  Policy,
  PolicyFile,
} from "../../components/Polycraft/hooks/useGetPolicies";
import { PolicyItem } from "../../components/common/Policy/hooks/useGetPolicyByCategory";
import { StatusTypes } from "../../components/common/Status";

/**
 * Checks if a timestamp is within 15 seconds of current time
 */
function isWithin15Seconds(createdAt: string): boolean {
  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  return now - createdTime <= 15000;
}

/**
 * Maps string status values to StatusTypes enum values
 */
function mapStringToStatusType(status: string): StatusTypes {
  const statusUpper = status.toUpperCase();

  // Map common status strings to StatusTypes
  switch (statusUpper) {
    case "ACTIVE":
      return StatusTypes.ACTIVE;
    case "DEACTIVATED":
      return StatusTypes.DEACTIVATED;
    case "DRAFTED":
    case "DRAFT":
      return StatusTypes.DRAFT;
    case "DELETED":
      return StatusTypes.DELETED;
    case "REJECTED":
      return StatusTypes.REJECTED;
    case "APPROVED":
      return StatusTypes.APPROVED;
    case "IN-REVIEW":
      return StatusTypes["IN-REVIEW"];
    case "SUCCESS":
      return StatusTypes.SUCCESS;
    case "PROCESSING":
    case "PENDING":
      return StatusTypes.PENDING;
    case "FAILED":
      return StatusTypes.FAILED;
    default:
      // If no mapping found, try to find a matching StatusTypes value
      const matchingStatus = Object.values(StatusTypes).find(
        (statusType) => statusType.toUpperCase() === statusUpper
      );
      return matchingStatus || StatusTypes.INACTIVE;
  }
}

/**
 * Determines the final status to display based on policy status and policy file status
 *
 * Logic based on mapping sheet:
 * - Active + Successful → Active
 * - Active + Processing → Processing
 * - Active + Failed → Failed
 * - Deactivated + (any) → Deactivated
 * - Drafted + (any) → Drafted
 * - Deleted + (any) → Deleted
 * - Rejected + (any) → Rejected
 * - Approved + Successful → Active
 * - Approved + Processing → Processing
 * - Approved + Failed → Failed
 * - In-Review + Successful → In-Review
 * - In-Review + Processing → Processing
 * - In-Review + Failed → Failed
 *
 * @param policy - The policy object containing status and policy_files
 * @param selectedVersionId - Optional specific version ID to check status for
 * @returns The final status to display as StatusTypes
 */
export function getPolicyFinalStatus(
  policy: Policy,
  selectedVersionId?: string
): StatusTypes {
  const policyStatus = policy.status.toLowerCase();

  // Get the version status and selected file
  let versionStatus: string = "";
  let selectedFile: PolicyFile | undefined;

  if (policy.policy_files && policy.policy_files.length > 0) {
    if (selectedVersionId) {
      selectedFile = policy.policy_files.find(
        (file) => file.id === selectedVersionId
      );
      versionStatus = selectedFile ? selectedFile.status.toLowerCase() : "";
    } else {
      // Use the latest version's status (files are sorted by version desc)
      selectedFile = policy.policy_files[0];
      versionStatus = selectedFile.status.toLowerCase();
    }
  }

  // Apply mapping logic based on policy status and version status
  switch (policyStatus) {
    case "active":
      if (versionStatus === "successful") {
        return StatusTypes.ACTIVE;
      } else if (versionStatus === "processing") {
        return StatusTypes.PENDING;
      } else if (versionStatus === "failed") {
        // If file was created within 15 seconds, show as uploading
        if (selectedFile && isWithin15Seconds(selectedFile.created_at)) {
          return StatusTypes.UPLOADING;
        }
        return StatusTypes.FAILED;
      }
      // If no version status or unknown, return active
      return StatusTypes.ACTIVE;

    case "deactivated":
      return StatusTypes.DEACTIVATED;

    case "drafted":
    case "draft":
      return StatusTypes.DRAFT;

    case "deleted":
      return StatusTypes.DELETED;

    case "rejected":
      return StatusTypes.REJECTED;

    case "approved":
      if (versionStatus === "successful") {
        return StatusTypes.ACTIVE;
      } else if (versionStatus === "processing") {
        return StatusTypes.PENDING;
      } else if (versionStatus === "failed") {
        // If file was created within 15 seconds, show as uploading
        if (selectedFile && isWithin15Seconds(selectedFile.created_at)) {
          return StatusTypes.UPLOADING;
        }
        return StatusTypes.FAILED;
      }
      // If no version status, return approved
      return StatusTypes.APPROVED;

    case "in-review":
      if (versionStatus === "successful") {
        return StatusTypes["IN-REVIEW"];
      } else if (versionStatus === "processing") {
        return StatusTypes.PENDING;
      } else if (versionStatus === "failed") {
        // If file was created within 15 seconds, show as uploading
        if (selectedFile && isWithin15Seconds(selectedFile.created_at)) {
          return StatusTypes.UPLOADING;
        }
        return StatusTypes.FAILED;
      }
      // If no version status, return in-review
      return StatusTypes["IN-REVIEW"];

    default:
      // Fallback to original mapping function for unknown statuses
      return mapStringToStatusType(policy.status);
  }
}

/**
 * Determines the final status to display for PolicyItem based on policy status and policy file status
 *
 * Logic:
 * - If policy status is "active" and there is a policy file, return the file's status
 * - Otherwise, return the policy status
 *
 * Note: PolicyItem structure is different from Policy - it has a single policy_file object
 * instead of policy_files array, and the file doesn't have a status field directly.
 * For PolicyItem, we assume the file status is derived from the overall policy status.
 *
 * @param policyItem - The PolicyItem object containing status and policy_file
 * @returns The final status to display as StatusTypes
 */
export function getPolicyItemFinalStatus(policyItem: PolicyItem): StatusTypes {
  // For PolicyItem, the status field already represents the final status
  // as it's processed from the backend data that includes file processing status
  return mapStringToStatusType(policyItem.status);
}

/**
 * Gets the status for a specific policy file
 *
 * @param policy - The policy object
 * @param fileId - The ID of the specific file
 * @returns The file status or policy status if file not found
 */
export function getPolicyFileStatus(policy: Policy, fileId: string): string {
  const file = policy.policy_files?.find((f) => f.id === fileId);

  if (!file) {
    return policy.status;
  }

  // If policy is active, return file status
  if (policy.status === "active") {
    return file.status;
  }

  // Otherwise return policy status
  return policy.status;
}

/**
 * Type guard to check if a status is a policy file status
 */
export function isPolicyFileStatus(
  status: string
): status is "success" | "processing" | "failed" {
  return ["success", "processing", "failed"].includes(status);
}

/**
 * Type guard to check if a status is a policy status
 */
export function isPolicyStatus(
  status: string
): status is
  | "active"
  | "deactivated"
  | "drafted"
  | "deleted"
  | "rejected"
  | "approved"
  | "In-Review" {
  return [
    "active",
    "deactivated",
    "drafted",
    "deleted",
    "rejected",
    "approved",
    "In-Review",
  ].includes(status);
}
