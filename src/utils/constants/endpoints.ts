import { Envs } from "../data/Envs";

// constants for api endpoints
export const currentEnv = import.meta.env.VITE_REACT_APP_ENV as Envs;
export const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
export const MAKER_CHECKER_BASE_URL = import.meta.env
  .VITE_REACT_APP_MAKER_CHECKER_API_URL;
export const IS_HR_PORTAL =
  currentEnv === Envs.DEV &&
  window.location.href.startsWith("https://askdonna.tartanhq.com");

export const isAbfl = currentEnv === Envs.ABFL;
