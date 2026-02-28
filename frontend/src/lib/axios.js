// frontend/src/lib/axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "/api", // This tells the frontend to talk to the same domain it's hosted on
  withCredentials: true,
});
