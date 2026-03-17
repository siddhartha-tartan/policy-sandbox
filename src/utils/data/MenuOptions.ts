import FluentCode from "../../assets/Icons/FluentCode";
import MarkLineTicks from "../../assets/Icons/MarkLineTicks";
import QueryIcon from "../../assets/Icons/QueryIcon";
import UsersIcon from "../../assets/Icons/UsersIcon";
import {
  BASE_MODULE_ROUTE,
  BASE_ROUTES,
  FeatureIdentifiers,
} from "../constants/constants";

export interface IMenuOption {
  path: string;
  icon: React.ComponentType;
  text: string;
  activePath: Array<string>;
  featureIdentifier?: string;
}

const createMenuOption = (
  path: string,
  icon: React.ComponentType,
  text: string,
  activePath: string[],
  featureIdentifier?: string,
): IMenuOption => ({
  path,
  icon,
  text,
  activePath,
  featureIdentifier,
});

export const ADMIN_MENU_OPTIONS: IMenuOption[] = [
  createMenuOption(
    `${BASE_ROUTES.ADMIN}/${BASE_MODULE_ROUTE.POLYCRAFT}`,
    FluentCode,
    "Policies",
    [`${BASE_ROUTES.ADMIN}/${BASE_MODULE_ROUTE.POLYCRAFT}`],
    FeatureIdentifiers.POLICIES,
  ),
  createMenuOption(
    `${BASE_ROUTES.ADMIN}/${BASE_MODULE_ROUTE.MAKER_CHECKER}`,
    MarkLineTicks,
    "Approvals",
    [`${BASE_ROUTES.ADMIN}/${BASE_MODULE_ROUTE.MAKER_CHECKER}`],
    FeatureIdentifiers.POLICIES,
  ),
  createMenuOption(
    `${BASE_ROUTES.ADMIN}/${BASE_MODULE_ROUTE.QUERYGEN_2}`,
    QueryIcon,
    "QueryGen",
    [`${BASE_ROUTES.ADMIN}/${BASE_MODULE_ROUTE.QUERYGEN_2}`],
    FeatureIdentifiers.QUERY_GEN,
  ),
  createMenuOption(
    `${BASE_ROUTES.ADMIN}/${BASE_MODULE_ROUTE.USER}`,
    UsersIcon,
    "User Management",
    [`${BASE_ROUTES.ADMIN}/${BASE_MODULE_ROUTE.USER}`],
    FeatureIdentifiers.USER_MANAGEMENT,
  ),
];

export const SPOC_MENU_OPTIONS: IMenuOption[] = [
  createMenuOption(
    `${BASE_ROUTES.SPOC}/${BASE_MODULE_ROUTE.POLYCRAFT}`,
    FluentCode,
    "Policies",
    [`${BASE_ROUTES.SPOC}/${BASE_MODULE_ROUTE.POLYCRAFT}`],
    FeatureIdentifiers.POLICIES,
  ),
  createMenuOption(
    `${BASE_ROUTES.SPOC}/${BASE_MODULE_ROUTE.MAKER_CHECKER}`,
    MarkLineTicks,
    "Approvals",
    [`${BASE_ROUTES.SPOC}/${BASE_MODULE_ROUTE.MAKER_CHECKER}`],
    FeatureIdentifiers.POLICIES,
  ),
  createMenuOption(
    `${BASE_ROUTES.SPOC}/${BASE_MODULE_ROUTE.QUERYGEN_2}`,
    QueryIcon,
    "QueryGen",
    [`${BASE_ROUTES.SPOC}/${BASE_MODULE_ROUTE.QUERYGEN_2}`],
    FeatureIdentifiers.QUERY_GEN,
  ),
  createMenuOption(
    `${BASE_ROUTES.SPOC}/${BASE_MODULE_ROUTE.USER}`,
    UsersIcon,
    "User Management",
    [`${BASE_ROUTES.SPOC}/${BASE_MODULE_ROUTE.USER}`],
    FeatureIdentifiers.USER_MANAGEMENT,
  ),
];
