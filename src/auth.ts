import axios, { AxiosInstance } from "axios";
import { API_BASE_URL } from "./utils/constants/endpoints";
import { userStore } from "./store/userStore";

export const getProtectedAxios = (): AxiosInstance => {
  const instance = axios.create();
  let isRefreshing = false;
  let refreshSubscribers: ((token: string) => void)[] = [];
  const { organisationId } = userStore.getState();

  const onRefreshed = (newAccessToken: string) => {
    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];
  };

  const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
  };

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers["X-Organisation-Id"] = organisationId || "";
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { config, response } = error;
      if (response?.status === 401 || response?.status === 403) {
        if (!isRefreshing) {
          isRefreshing = true;
          const refreshToken = localStorage.getItem("refreshToken");

          try {
            const { data } = await axios.get(
              `${API_BASE_URL}/refresh?refresh=${refreshToken}`
            );
            const { access_token, refresh_token } = data.data;

            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("refreshToken", refresh_token);

            instance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${access_token}`;
            config.headers["Authorization"] = `Bearer ${access_token}`;

            onRefreshed(access_token);
            isRefreshing = false;

            return instance(config);
          } catch (err) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            isRefreshing = false;
            return Promise.reject(err);
          }
        }

        return new Promise((resolve) => {
          addRefreshSubscriber((newAccessToken) => {
            config.headers["Authorization"] = `Bearer ${newAccessToken}`;
            resolve(instance(config));
          });
        });
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
