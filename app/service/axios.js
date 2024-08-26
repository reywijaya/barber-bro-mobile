import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://10.10.102.104:3000"
});

export default axiosInstance;