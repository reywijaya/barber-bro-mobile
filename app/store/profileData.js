import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
    profileData: {},
};

const profileData = createSlice({
    name: "profileData",
    initialState: INITIAL_STATE,
    reducers: {
        setProfileData: (state, action) => {
            state.profileData = action.payload;
        },
    },
});

export const { setProfileData } = profileData.actions;

export default profileData.reducer;