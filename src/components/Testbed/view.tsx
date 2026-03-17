import { AnimatePresence } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import ReviewModal from "../Polycraft/pages/Policies/components/ReviewModal";
import { TESTBED_SUB_ROUTES } from "./contants";
import AdvancedDataCreation from "./pages/AdvancedDataCreation/view";
import HistoricalDataTesting from "./pages/HistoricalDataTesting/view";

export default function Testbed() {
  return (
    <AnimatePresence>
      <Routes>
        <Route
          path={`${TESTBED_SUB_ROUTES.ADVANCED_DATA_CREATION}/*`}
          element={<AdvancedDataCreation />}
        />
        <Route
          path={`${TESTBED_SUB_ROUTES.HISTORICAL_DATA_TESTING}/*`}
          element={<HistoricalDataTesting />}
        />
      </Routes>
      <ReviewModal />
    </AnimatePresence>
  );
}
