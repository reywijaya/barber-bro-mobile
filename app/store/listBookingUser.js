import { createSlice } from "@reduxjs/toolkit";

const listBookingUser = createSlice({
    name: "listBookingUser",
    initialState: {
        listBookingUser: []
    },
    reducers: {
        setListBookingUser: (state, action) => {
            state.listBookingUser = action.payload;
        }
    }
    
})

export const { setListBookingUser } = listBookingUser.actions;
export default listBookingUser.reducer