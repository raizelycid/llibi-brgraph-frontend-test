import axios from "axios";

export default axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  },
});
