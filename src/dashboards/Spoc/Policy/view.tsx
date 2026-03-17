import { Route, Routes } from "react-router-dom";
import AllPolicyCategories from "../../../components/common/Policy/AllPolicyCategories";
import ArchivedPolicy from "../../../components/common/Policy/ArchivedPolicy/view";
import IndivisualPolicyDetail from "../../../components/common/Policy/IndivisualPolicyDetail/view";
import PolicyDetails from "../../../components/common/Policy/PolicyDetails/view";
import { POLICY_SUB_ROUTES } from "../../../components/common/Policy/utils/constants";
import AddPolicy from "./pages/AddPolicy/view";
import ModifyPolicy from "./pages/ModifyPolicy/view";
import ComparePolicy from "../../../components/common/ComparePolicy/view";

const Policy = () => {
  return (
    <Routes>
      <Route
        path={POLICY_SUB_ROUTES.CATEGORIES_DETAIL}
        element={<PolicyDetails />}
      />
      <Route
        path={POLICY_SUB_ROUTES.POLICY_DETAIL}
        element={<IndivisualPolicyDetail />}
      />
      <Route path={POLICY_SUB_ROUTES.EDIT_POLICY} element={<ModifyPolicy />} />
      <Route path={POLICY_SUB_ROUTES.ADD_POLICY} element={<AddPolicy />} />
      <Route
        path={POLICY_SUB_ROUTES.ALL_CATEGORY}
        element={<AllPolicyCategories />}
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
