import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatclone-2bsx.onrender.com/api",
});
