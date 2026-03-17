import { TESTBED_SUB_ROUTES } from "../contants";

export function getTestBedFlowType():
  | (typeof TESTBED_SUB_ROUTES)[keyof typeof TESTBED_SUB_ROUTES]
  | "" {
  const location = window.location.pathname;
  if (location.includes(TESTBED_SUB_ROUTES.ADVANCED_DATA_CREATION))
    return TESTBED_SUB_ROUTES.ADVANCED_DATA_CREATION;
  else if (location.includes(TESTBED_SUB_ROUTES.HISTORICAL_DATA_TESTING))
    return TESTBED_SUB_ROUTES.HISTORICAL_DATA_TESTING;
  else return "";
}
