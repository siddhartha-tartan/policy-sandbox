import { Route, Routes } from "react-router-dom";
import { ASSESMENT_SUB_ROUTES } from "../../../components/common/Assesment/utils/constants";
import PageLayout from "../../../components/common/PageLayout";
import { BASE_ROUTES } from "../../../utils/constants/constants";
import AddAssesment from "./pages/AddAssesment/view";
import AllAssesments from "./pages/AllAssesments/view";
import IndivisualAssesment from "./pages/IndivisualAssesment/view";
import useGetUserType from "../../../hooks/useGetUserType";

const Assessment = () => {
  const userType = useGetUserType();
  return (
    <Routes>
      <Route
        path={ASSESMENT_SUB_ROUTES.VIEW}
        element={<IndivisualAssesment />}
      />
      <Route
        path={ASSESMENT_SUB_ROUTES.ADD}
        element={
          <PageLayout
            breadCrumbsData={[
              {
                label: "Assessments",
                navigateTo: `${BASE_ROUTES[userType]}/assessment`,
              },
              {
                label: "Create new asessment",
                navigateTo: `/`,
              },
            ]}
          >
            <AddAssesment />
          </PageLayout>
        }
      />
      <Route
        path={ASSESMENT_SUB_ROUTES.EDIT}
        element={
          <PageLayout
            breadCrumbsData={[
              {
                label: "Assessments",
                navigateTo: `${BASE_ROUTES[userType]}/assessment`,
              },
              {
                label: "Edit asessment",
                navigateTo: `/`,
              },
            ]}
          >
            <AddAssesment />
          </PageLayout>
        }
      />
      <Route
        path={ASSESMENT_SUB_ROUTES.BASE}
        element={
          <PageLayout>
            <AllAssesments />
          </PageLayout>
        }
      />
    </Routes>
  );
};

export default Assessment;
