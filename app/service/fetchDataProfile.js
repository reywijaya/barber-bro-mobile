import { setProfileData } from "../store/profileData";
import axiosInstance from "./axios";
import { useDispatch, useSelector } from "react-redux";

export const getDataProfile = async () => {
  const user = useSelector((state) => state.user.loggedInUser);
  const dispatch=useDispatch();
  try {
    const response = await axiosInstance.get("/customers/current", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    dispatch(setProfileData(response.data.data));
    return response.data.data;
  } catch (error) {
    console.error("Error fetching profile data:", error.response.data.message);
    throw error;
  }
};
