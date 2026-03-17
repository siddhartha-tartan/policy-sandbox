import { Provider } from "jotai";
import { Route, Routes } from "react-router-dom";
import AddUserCsv from "./pages/AddUserCsv/view";
import AddUserManual from "./pages/AddUserManual/view";
import UserManagementBase from "./pages/UserManagementBase/view";
import { USER_SUB_ROUTES } from "./utils/constant";

const UserManagement = () => {
  return (
    <Provider>
      <Routes>
        <Route path={USER_SUB_ROUTES.ADD_USER_CSV} element={<AddUserCsv />} />
        <Route
          path={USER_SUB_ROUTES.ADD_USER_MANUAL}
          element={<AddUserManual />}
        />
        <Route
          path={USER_SUB_ROUTES.MODIFY_USER_CSV}
          element={<AddUserCsv isEdit={true} />}
        />
        <Route path={USER_SUB_ROUTES.BASE} element={<UserManagementBase />} />
      </Routes>
    </Provider>
  );
};

export default UserManagement;
