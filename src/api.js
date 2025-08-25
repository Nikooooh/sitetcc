import axios from "axios";

export const api = axios.create({
  baseURL: "https://backendtcc-production-b1b7.up.railway.app/api/auth",
});
