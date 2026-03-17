import { useEffect, useMemo } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./components/layouts/ErrorPage";
import ProtectedLayout from "./components/layouts/ProtectedLayout";
import useGetFeatures from "./hooks/useGetFeatures";
import useGetUserType from "./hooks/useGetUserType";
import { userStore } from "./store/userStore";
import { UserType } from "./utils/constants/constants";
import { ROUTE_DATA } from "./utils/constants/interfaces";
import { ADMIN_ROUTES, SPOC_ROUTES } from "./utils/data/Routes";

const getRoutesByUserType = (
  userType: UserType,
  homeRoute: string,
  enabledFeatures: string[]
) => {
  let routes: ROUTE_DATA[] = [];
  switch (userType) {
    case UserType.ADMIN:
      routes = ADMIN_ROUTES;
      break;
    case UserType.SPOC:
      routes = SPOC_ROUTES;
      break;
    default:
      routes = SPOC_ROUTES;
      break;
  }

  routes = routes?.filter((e) => enabledFeatures?.includes(e?.name));

  routes.push({
    path: "*",
    element: <Navigate to={homeRoute || "/spoc/polycraft"} />,
    name: "Fallback",
  });

  return createBrowserRouter(
    createRoutesFromElements(
      <Route
        element={<ProtectedLayout />}
        errorElement={<ErrorPage />}
      >
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Route>
    )
  );
};

const Router = () => {
  const userType: UserType = useGetUserType();
  const { data: feature_list } = useGetFeatures();
  const { homeRoute, setUserType } = userStore();

  useEffect(() => {
    if (!userType) {
      setUserType(UserType.SPOC);
      localStorage.setItem("accessToken", "mock-token");
      localStorage.setItem("refreshToken", "mock-refresh-token");
    }
  }, [userType]);

  const enabledFeatures =
    feature_list?.feature_list
      ?.filter((feature) => feature.is_enable)
      .map((feature) => feature.name) || [];

  const router = useMemo(
    () =>
      getRoutesByUserType(userType || UserType.SPOC, homeRoute, [
        ...enabledFeatures,
        "Fallback",
      ]),
    [userType, homeRoute, enabledFeatures.join(",")]
  );

  return <RouterProvider router={router} />;
};

export default Router;
