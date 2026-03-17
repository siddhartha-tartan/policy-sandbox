import { Route, Routes } from "react-router-dom";
import AllQuery from "../../../components/common/Query/AllQuery/view";
import QueryThread from "../../../components/common/Query/QueryThread/view";
import { QUERY_SUB_ROUTES } from "../../../components/common/Query/utils/constants";

export default function Query() {
  return (
    <Routes>
      <Route path={QUERY_SUB_ROUTES.THREAD} element={<QueryThread />} />
      <Route path={QUERY_SUB_ROUTES.BASE} element={<AllQuery />} />
    </Routes>
  );
}
