import axios from "axios";
import store from "../redux/store";
import { setUser, signedOut } from "../redux/authSlice";

/* global process */
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_ADDRESS,
  withCredentials: true, // send cookies
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await api.post("/auth/refresh-token");
        const currentUser = store.getState().auth.user;
        store.dispatch(
          setUser({ user: currentUser, token: res.data.accessToken })
        );
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        store.dispatch(signedOut());
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
