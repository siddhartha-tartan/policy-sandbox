import { AnimatePresence } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import { WORKFLOW_SUB_ROUTES } from "./constant";
import WorkFlowBase from "./pages/WorkFlowBase/view";
import AddWorkFlow from "./pages/AddWorkFlow/view";
import EditWorkFlow from "./pages/EditWorkFlow/view";

const WorkFlow = () => {
  return (
    <AnimatePresence>
      <Routes>
        <Route
          path={`${WORKFLOW_SUB_ROUTES.BASE}`}
          element={<WorkFlowBase />}
        />
        <Route path={`${WORKFLOW_SUB_ROUTES.ADD}`} element={<AddWorkFlow />} />
        <Route
          path={`${WORKFLOW_SUB_ROUTES.EDIT}`}
          element={<EditWorkFlow />}
        />
      </Routes>
    </AnimatePresence>
  );
};

export default WorkFlow;
