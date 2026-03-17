import { UserType } from "../constants/constants";

export function formatUserType(userType: string): string {
  switch (userType) {
    case UserType.SPOC:
      return "Policy Manager";
    case UserType.STAFF_USER:
      return "User";
    case UserType.QUERY_STAFF_USER:
      return "Query User";
    case UserType.ASSESSMENT_MANAGER:
      return "Assessment Manager";
    case UserType.SUPER_ADMIN:
      return "Super Admin";
    default:
      return "Admin";
  }
}
