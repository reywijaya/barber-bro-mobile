import axiosInstance from "./axios";

export const getBarbershop = async () => {
  const response = await axiosInstance.get("/barbers");
  return response.data.data;
}

export const getBarbershopById = async (id) => {
  const response = await axiosInstance.get(`/barbers/${id}`);
  return response.data.data;
}