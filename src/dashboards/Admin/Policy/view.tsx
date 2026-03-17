import { Route, Routes } from "react-router-dom";
import ArchivedPolicy from "../../../components/common/Policy/ArchivedPolicy/view";
import IndivisualPolicyDetail from "../../../components/common/Policy/IndivisualPolicyDetail/view";
import { POLICY_SUB_ROUTES } from "../../../components/common/Policy/utils/constants";
import AdminLoanCategoryView from "./pages/AdminLoanCategoryView/view";
import AdminPolicyDetails from "./pages/AdminPolicyDetails";
import ComparePolicy from "../../../components/common/ComparePolicy/view";

const Policy = () => {
  return (
    <Routes>
      <Route
        path={POLICY_SUB_ROUTES.CATEGORIES_DETAIL}
        element={<AdminPolicyDetails />}
      />
      <Route
        path={POLICY_SUB_ROUTES.POLICY_DETAIL}
        element={<IndivisualPolicyDetail />}
      />
      <Route
        path={POLICY_SUB_ROUTES.ALL_CATEGORY}
        element={<AdminLoanCategoryView />}
      />
      <Route
        path={POLICY_SUB_ROUTES.ARCHIVED_POLICY}
        element={<ArchivedPolicy />}
      />
      <Route
        path={POLICY_SUB_ROUTES.COMPARE_POLICY}
        element={<ComparePolicy />}
      />
    </Routes>
  );
};

export default Policy;
