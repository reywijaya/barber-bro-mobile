import axiosInstance from "./axios";

export const getReviews = async () => {
    const response = await axiosInstance.get("/reviews");
    return response.data;
}