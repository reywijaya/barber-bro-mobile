export const fetchGetGallery = async (barbershopId) => {
  try {
    const response = await axiosInstance.get(`/barbers/${barbershopId}/gallery`);
    return response.data.data;
  } catch (error) {
    console.log(error.response.data.message);
  }
};
