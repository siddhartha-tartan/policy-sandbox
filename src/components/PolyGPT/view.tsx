import { Route, Routes } from "react-router-dom";
import { POLYGPT_SUB_ROUTES } from "./constants";
import IndivisualGPT from "./pages/IndivisualGPT/view";
import NewGPT from "./pages/NewGPT/view";
import { AnimatePresence, motion } from "framer-motion";
import { Provider } from "jotai";

export default function PolyGPT() {
  return (
    <Provider>
      <AnimatePresence>
        <Routes>
          <Route
            path={POLYGPT_SUB_ROUTES.THREAD}
            element={
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                <IndivisualGPT />
              </motion.div>
            }
          />
          <Route path={POLYGPT_SUB_ROUTES.BASE} element={<NewGPT />} />
        </Routes>
      </AnimatePresence>
    </Provider>
  );
}
