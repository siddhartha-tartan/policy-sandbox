export enum BASE_ROUTES {
  SUPER_ADMIN = "/super-admin",
  ADMIN = "/admin",
  SPOC = "/spoc",
  STAFF_USER = "/staff",
  QUERY_STAFF_USER = "/query-staff",
  ASSESSMENT_MANAGER = "/assessment-manager",
}

export const FeatureIdentifiers = {
  DASHBOARD: "Dashboard",
  POLYCRAFT: "PolyCraft",
  POLICIES_ABFL: "Policies ABFL",
  POLYGPT: "PolyGPT",
  POLICIES: "Policies",
  RULESENSE: "RuleSense",
  QUERY_GEN: "QueryGen",
  CATEGORY_MANAGEMENT: "Category Management",
  USER_MANAGEMENT: "User Management",
  ASSESSMENTS: "Assessments",
  DISCUSSIONS: "Discussions",
  FAQ: "FAQ",
  REPORTS: "Reports",
  POLICY_COMPARISON: "PolicyComparison",
  AI_ASSESSMENT: "AI_ASSESSMENT",
  WATERMARK: "WaterMark",
  FILES_FOLDERS: "Files_Folders",
  ORGANISATION: "Organisation",
  AGENTS: "PolyCraft",
};

export const BASE_MODULE_ROUTE = {
  DASHBOARD: "home",
  POLICY_INTERNAL: "polycraft",
  POLYCRAFT_GPT: "polycraft-gpt",
  POLYGPT: "polygpt",
  POLICYGEN: "policygen",
  QUERYGEN: "querygen",
  QUERYGEN_2: "querygen2",
  ASSESSMENT: "assessment",
  POLICY: "policy",
  USER: "user",
  QUERY: "query",
  REPORTS: "reports",
  FAQ: "faq",
  MAKER_CHECKER: "maker-checker",
  POLYCRAFT: "polycraft",
  CATEGORY_MANAGEMENT: "category-management",
  FILES_FOLDERS: "files-folders",
  ORGANISATION: "organisation",
  AGENTS: "agents",
};

export const FeatureKeyToBaseRouteMapper = {
  [FeatureIdentifiers.DASHBOARD]: BASE_MODULE_ROUTE.DASHBOARD,
  [FeatureIdentifiers.POLYCRAFT]: BASE_MODULE_ROUTE.POLYCRAFT_GPT,
  [FeatureIdentifiers.POLICIES]: BASE_MODULE_ROUTE.POLICY_INTERNAL,
  [FeatureIdentifiers.POLICIES_ABFL]: BASE_MODULE_ROUTE.POLICY,
  [FeatureIdentifiers.POLYGPT]: BASE_MODULE_ROUTE.POLYGPT,
  [FeatureIdentifiers.RULESENSE]: BASE_MODULE_ROUTE.POLICYGEN,
  [FeatureIdentifiers.QUERY_GEN]: BASE_MODULE_ROUTE.QUERYGEN,
  [FeatureIdentifiers.USER_MANAGEMENT]: BASE_MODULE_ROUTE.USER,
  [FeatureIdentifiers.ASSESSMENTS]: BASE_MODULE_ROUTE.ASSESSMENT,
  [FeatureIdentifiers.DISCUSSIONS]: BASE_MODULE_ROUTE.QUERY,
  [FeatureIdentifiers.FAQ]: BASE_MODULE_ROUTE.FAQ,
  [FeatureIdentifiers.REPORTS]: BASE_MODULE_ROUTE.REPORTS,
  [FeatureIdentifiers.CATEGORY_MANAGEMENT]:
    BASE_MODULE_ROUTE.CATEGORY_MANAGEMENT,
  [FeatureIdentifiers.FILES_FOLDERS]: BASE_MODULE_ROUTE.FILES_FOLDERS,
  [FeatureIdentifiers.ORGANISATION]: BASE_MODULE_ROUTE.ORGANISATION,
  [FeatureIdentifiers.AGENTS]: BASE_MODULE_ROUTE.AGENTS,
};

export enum UserType {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SPOC = "SPOC",
  STAFF_USER = "STAFF_USER",
  QUERY_STAFF_USER = "QUERY_STAFF_USER",
  ASSESSMENT_MANAGER = "ASSESSMENT_MANAGER",
}

export const POLICY_ROUTES: Record<UserType, string> = {
  [UserType.SUPER_ADMIN]: `/super-admin/${BASE_MODULE_ROUTE.ORGANISATION}`,
  [UserType.ADMIN]: `/admin/${BASE_MODULE_ROUTE.POLICY}`,
  [UserType.SPOC]: `/spoc/${BASE_MODULE_ROUTE.POLICY}`,
  [UserType.STAFF_USER]: `/staff/${BASE_MODULE_ROUTE.POLICY}`,
  [UserType.QUERY_STAFF_USER]: `/query-staff/${BASE_MODULE_ROUTE.POLICY}`,
  [UserType.ASSESSMENT_MANAGER]: "/assessment-manager/assessment",
};

export const USER_ROUTES: Record<UserType, string> = {
  [UserType.SUPER_ADMIN]: `/admin/${BASE_MODULE_ROUTE.USER}`,
  [UserType.ADMIN]: `/admin/${BASE_MODULE_ROUTE.USER}`,
  [UserType.SPOC]: `/spoc/${BASE_MODULE_ROUTE.USER}`,
  [UserType.STAFF_USER]: `/staff/${BASE_MODULE_ROUTE.USER}`,
  [UserType.QUERY_STAFF_USER]: `/query-staff/${BASE_MODULE_ROUTE.USER}`,
  [UserType.ASSESSMENT_MANAGER]: "/assessment-manager/assessment",
};

export enum DashboardFeaturesEnum {
  RECENT_ATTESTATIONS = "recent_attestations",
  PENDING_QUERIES = "pending_queries",
  NEEDS_ATTENTION = "needs_attention",
  RECENT_ASSESSMENT = "recent_assessment",
}
