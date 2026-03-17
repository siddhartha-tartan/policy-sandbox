import { AnimatePresence } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import ReviewModal from "../../../Polycraft/pages/Policies/components/ReviewModal";
import { HISTORICAL_DATA_TESTING_SUB_ROUTES } from "./constants";
import Test from "../AdvancedDataCreation/pages/Test/view";
import Result from "../AdvancedDataCreation/pages/Result/view";
import BreRule from "../AdvancedDataCreation/pages/BreRule/view";
import UploadTestData from "./pages/UploadTestData/view";

export default function HistoricalDataTesting() {
  return (
    <AnimatePresence>
      <Routes>
        <Route
          path={HISTORICAL_DATA_TESTING_SUB_ROUTES.TEST}
          element={<Test />}
        />
        <Route
          path={HISTORICAL_DATA_TESTING_SUB_ROUTES.UPLOAD}
          element={<UploadTestData />}
        />
        <Route
          path={HISTORICAL_DATA_TESTING_SUB_ROUTES.RESULT}
          element={<Result />}
        />
        <Route
          path={HISTORICAL_DATA_TESTING_SUB_ROUTES.BASE}
          element={<BreRule />}
        />
      </Routes>
      <ReviewModal />
    </AnimatePresence>
  );
}
