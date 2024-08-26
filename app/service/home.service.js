import axiosInstance from "./axios";

export const getPostsData = async () => {
    const response = await axiosInstance.get("/posts");
    return response.data;
};

export const getStoryData = async () => {
    const response = await axiosInstance.get("/stories");
    return response.data;
};