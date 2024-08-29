import axiosInstance from "./axios";

export const getBarbershop = async () => {
  const response = await axiosInstance.get("/barbershops");
  return response.data;
}

export const getBarbershopById = async (id) => {
  const response = await axiosInstance.get(`/barbershops/${id}`);
  return response.data;
}