import { Route, Routes } from "react-router-dom";
import { QUERYGEN_SUB_ROUTES } from "../../../components/QueryGen/constants";
import SchemaDirectory from "../../../components/QueryGen/pages/SchemaDirectory/view";
import UploadSchema from "../../../components/QueryGen/pages/UploadSchema/view";
import QueryGenBase from "../../../components/QueryGen/view";

export default function QueryGen() {
  return (
    <Routes>
      <Route path={QUERYGEN_SUB_ROUTES.UPLOAD} element={<UploadSchema />} />
      <Route path={QUERYGEN_SUB_ROUTES.SCHEMAS} element={<SchemaDirectory />} />
      <Route path={QUERYGEN_SUB_ROUTES.BASE} element={<QueryGenBase />} />
    </Routes>
  );
}
