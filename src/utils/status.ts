enum AssessmentStatus {
  DRAFTED = "DRAFTED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  SCHEDULE = "SCHEDULE",
  CANCELLED = "CANCELLED",
}

enum PastAssessmentStatus {
  PASSED = "PASSED",
  MISSED = "MISSED",
  FAILED = "FAILED",
}

enum PolicyStatus {
  ACTIVE = "active",
  DRAFTED = "drafted",
  DELETED = "deleted",
}

enum UploadStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum AssessmentResultStatus {
  PENDING = "PENDING",
  ATTEMPTED = "ATTEMPTED",
  ABSENT = "ABSENT",
}

type ModuleName =
  | "AssessmentStatus"
  | "PastAssessmentStatus"
  | "PolicyStatus"
  | "UploadStatus"
  | "UserStatus"
  | "AssessmentResultStatus";

export const getStatusList = (module: ModuleName): string[] => {
  switch (module) {
    case "AssessmentStatus":
      return Object.values(AssessmentStatus);
    case "PastAssessmentStatus":
      return Object.values(PastAssessmentStatus);
    case "PolicyStatus":
      return Object.values(PolicyStatus);
    case "UploadStatus":
      return Object.values(UploadStatus);
    case "UserStatus":
      return Object.values(UserStatus);
    case "AssessmentResultStatus":
      return Object.values(AssessmentResultStatus);
    default:
      throw new Error("Invalid module name");
  }
};

export const getStatusOptions = (module: ModuleName) => {
  const statusList = getStatusList(module);
  return [
    ...statusList?.map((row) => {
      return {
        label: row,
        value: row,
      };
    }),
    { label: "All Status", value: "" },
  ];
};
