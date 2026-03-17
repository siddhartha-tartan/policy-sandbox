import { AnimatePresence, motion } from "framer-motion";
import { Provider } from "jotai";
import { Route, Routes } from "react-router-dom";
import { QUERYGEN2_SUB_ROUTES } from "./utils/constant";
import IndividualQueryGen2 from "./pages/IndividualQueryGen2/view";
import NewQueryGen2 from "./pages/NewQueryGen2/view";

export default function QueryGen2() {
  return (
    <Provider>
      <AnimatePresence>
        <Routes>
          <Route
            path={QUERYGEN2_SUB_ROUTES.THREAD}
            element={
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                <IndividualQueryGen2 />
              </motion.div>
            }
          />
          <Route path={QUERYGEN2_SUB_ROUTES.BASE} element={<NewQueryGen2 />} />
        </Routes>
      </AnimatePresence>
    </Provider>
  );
}
