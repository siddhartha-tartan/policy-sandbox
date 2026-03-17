import { Provider } from "jotai";
import { Route, Routes } from "react-router-dom";
import { POLICYGEN_SUB_ROUTES } from "../common/PolicyGen/utils/constants";
import PolicyDetail from "./pages/PolicyDetail/view";
import PolicyGenBase from "./pages/PolicyGenBase/view";
import ThreadView from "./pages/ThreadView/view";
import VariableMappingBase from "./pages/VariableMappingBase/view";

export default function PolicyGen() {
  return (
    <Provider>
      <Routes>
        <Route path={POLICYGEN_SUB_ROUTES.BASE} element={<PolicyGenBase />} />
        <Route
          path={POLICYGEN_SUB_ROUTES.POLICY_DETAILS}
          element={<PolicyDetail />}
        />
        <Route
          path={POLICYGEN_SUB_ROUTES.POLICY_GEN_DATA}
          element={<ThreadView />}
        />
        <Route
          path={POLICYGEN_SUB_ROUTES.VARIABLE_MAPPING}
          element={<VariableMappingBase />}
        />
        <Route
          path={POLICYGEN_SUB_ROUTES.VARIABLE_MAPPING_FILE}
          element={<VariableMappingBase />}
        />
      </Routes>
    </Provider>
  );
}
