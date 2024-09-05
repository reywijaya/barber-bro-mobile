import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://10.10.102.48:8080/api",
    headers: {
        "Content-Type": "application/json",
    }
});

export default axiosInstance;