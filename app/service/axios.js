import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://10.10.102.48:8085/api",
    // baseURL:"http://10.10.102.103:3000"
    headers: {
        "Content-Type": "application/json",
    }
});

export default axiosInstance;