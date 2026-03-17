import { AnimatePresence } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import ReviewModal from "../../../Polycraft/pages/Policies/components/ReviewModal";
import { ADVANCED_DATA_CREATION_SUB_ROUTES } from "./constants";
import BreRule from "./pages/BreRule/view";
import Result from "./pages/Result/view";
import Test from "./pages/Test/view";
import Variables from "./pages/Variables/view";

export default function AdvancedDataCreation() {
  return (
    <AnimatePresence>
      <Routes>
        <Route
          path={ADVANCED_DATA_CREATION_SUB_ROUTES.TEST}
          element={<Test />}
        />
        <Route
          path={ADVANCED_DATA_CREATION_SUB_ROUTES.RESULT}
          element={<Result />}
        />
        <Route
          path={ADVANCED_DATA_CREATION_SUB_ROUTES.BASE}
          element={<BreRule />}
        />
        <Route
          path={ADVANCED_DATA_CREATION_SUB_ROUTES.VARIABLES}
          element={<Variables />}
        />
      </Routes>
      <ReviewModal />
    </AnimatePresence>
  );
}
