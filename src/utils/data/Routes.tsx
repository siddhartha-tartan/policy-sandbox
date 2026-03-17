import PolyCraft from "../../components/Polycraft/view";
import MakerChecker from "../../components/common/MakerChecker/view";
import UserManagement from "../../components/common/UserManagement/view";
import QueryGen2 from "../../components/QueryGen2/view";
import {
  BASE_MODULE_ROUTE,
  BASE_ROUTES,
  FeatureIdentifiers,
  USER_ROUTES,
  UserType,
} from "../constants/constants";
import { ROUTE_DATA } from "../constants/interfaces";

export const ADMIN_ROUTES: ROUTE_DATA[] = [
  {
    path: `${BASE_ROUTES.ADMIN}/${BASE_MODULE_ROUTE.POLYCRAFT}/*`,
    element: <PolyCraft />,
    name: FeatureIdentifiers.POLICIES,
  },
  {
    path: `${BASE_ROUTES.ADMIN}/${BASE_MODULE_ROUTE.MAKER_CHECKER}/*`,
    element: <MakerChecker />,
    name: FeatureIdentifiers.POLICIES,
  },
  {
    path: `${BASE_ROUTES.ADMIN}/${BASE_MODULE_ROUTE.QUERYGEN_2}/*`,
    element: <QueryGen2 />,
    name: FeatureIdentifiers.QUERY_GEN,
  },
  {
    path: `${USER_ROUTES[UserType.ADMIN]}/*`,
    element: <UserManagement />,
    name: FeatureIdentifiers.USER_MANAGEMENT,
  },
];

export const SPOC_ROUTES: ROUTE_DATA[] = [
  {
    path: `${BASE_ROUTES.SPOC}/${BASE_MODULE_ROUTE.POLYCRAFT}/*`,
    element: <PolyCraft />,
    name: FeatureIdentifiers.POLICIES,
  },
  {
    path: `${BASE_ROUTES.SPOC}/${BASE_MODULE_ROUTE.MAKER_CHECKER}/*`,
    element: <MakerChecker />,
    name: FeatureIdentifiers.POLICIES,
  },
  {
    path: `${BASE_ROUTES.SPOC}/${BASE_MODULE_ROUTE.QUERYGEN_2}/*`,
    element: <QueryGen2 />,
    name: FeatureIdentifiers.QUERY_GEN,
  },
  {
    path: `${USER_ROUTES[UserType.SPOC]}/*`,
    element: <UserManagement />,
    name: FeatureIdentifiers.USER_MANAGEMENT,
  },
];
