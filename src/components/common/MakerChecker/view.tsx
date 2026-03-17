import { AnimatePresence } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import Approvals from "./pages/Approvals/view";
import { MAKER_CHECKER_SUB_ROUTES } from "./utils/constant";
import WorkFlow from "./pages/WorkFlow/view";
import AuditTrail from "./pages/AuditTrail/view";
import ApprovalTimeline from "./pages/ApprovalTimeline/view";
import ReviewChangesPage from "./pages/ApprovalTimeline/ReviewChangesPage";
import AuditTrailDetail from "./pages/AuditTrailDetail/view";

export default function MakerChecker() {
  return (
    <AnimatePresence>
      <Routes>
        <Route
          path={`${MAKER_CHECKER_SUB_ROUTES.BASE}`}
          element={<Approvals />}
        />
        <Route
          path={`${MAKER_CHECKER_SUB_ROUTES.REVIEW_CHANGES}`}
          element={<ReviewChangesPage />}
        />
        <Route
          path={`${MAKER_CHECKER_SUB_ROUTES.TIMELINE}`}
          element={<ApprovalTimeline />}
        />
        <Route
          path={`${MAKER_CHECKER_SUB_ROUTES.AUDIT_TRAIL}`}
          element={<AuditTrail />}
        />
        <Route
          path={`${MAKER_CHECKER_SUB_ROUTES.AUDIT_TRAIL_DETAIL}`}
          element={<AuditTrailDetail />}
        />
        <Route
          path={`${MAKER_CHECKER_SUB_ROUTES.WORKFLOW}/*`}
          element={<WorkFlow />}
        />
      </Routes>
    </AnimatePresence>
  );
}
