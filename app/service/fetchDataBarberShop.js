import axiosInstance from "./axios";

export const getBarbershop = async () => {
  const response = await axiosInstance.get("/barbershop");
  return response.data;
}
export const getServices = async () => {
  const response = await axiosInstance.get("/service");
  return response.data;
}
export const getFacilities = async () => {
  const response = await axiosInstance.get("/facility");
  return response.data;
}
export const getSocialMedia = async () => {
  const response = await axiosInstance.get("/social_media");
  return response.data;
}
export const getGallery = async () => {
  const response = await axiosInstance.get("/gallery_image");
  return response.data;
}
export const getPromotion = async () => {
  const response = await axiosInstance.get("/promotion");
  return response.data;
}
