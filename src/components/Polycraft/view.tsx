import { AnimatePresence } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import { POLYCRAFT_SUB_ROUTES } from "./constants";
import AddPolicy from "./pages/AddPolicy/view";
import ComparePolicy from "../common/ComparePolicy/view";
import ModifyPolicy from "./pages/EditPolicy/ModifyPolicy";
import ReviewModal from "./pages/Policies/components/ReviewModal";
import Policies from "./pages/Policies/view";
import ViewPolicy from "./pages/ViewPolicy/view";

export default function Polycraft() {
  return (
    <AnimatePresence>
      <Routes>
        <Route path={POLYCRAFT_SUB_ROUTES.ADD_POLICY} element={<AddPolicy />} />
        <Route
          path={POLYCRAFT_SUB_ROUTES.EDIT_POLICY}
          element={<ModifyPolicy />}
        />
        <Route
          path={POLYCRAFT_SUB_ROUTES.VIEW_POLICY}
          element={<ViewPolicy />}
        />
        <Route path={POLYCRAFT_SUB_ROUTES.POLICIES} element={<Policies />} />
        <Route path={POLYCRAFT_SUB_ROUTES.BASE} element={<Policies />} />
        <Route
          path={POLYCRAFT_SUB_ROUTES.COMPARE_POLICY}
          element={<ComparePolicy />}
        />
      </Routes>
      <ReviewModal />
    </AnimatePresence>
  );
}
