import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://kaviospix-backend-5744.onrender.com",
});

export default axiosInstance;
// "http://localhost:3000",
