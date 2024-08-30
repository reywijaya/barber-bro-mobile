// import axiosInstance from "./axios";
import axios from "axios";

export const getReviews = async () => {
    const response = await axios.get("http://10.10.102.103:3000/reviews");
    return response.data;
}