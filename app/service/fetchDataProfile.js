import { useEffect } from "react";
import { setProfileData } from "../store/profileData";
import axiosInstance from "./axios";

export const getDataProfile = async (dispatch, token) => {
  try {
    const response = await axiosInstance.get("/customers/current", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setProfileData(response.data.data));
    return response.data.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error; 
  }
};