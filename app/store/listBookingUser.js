import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const listBookingUser = createSlice({
    name: "listBookingUser",
    initialState: {
        listBookingUser: []
    },
    reducers: {
        setListBookingUser: (state, action) => {
            state.listBookingUser = action.payload;

            AsyncStorage.setItem('listBookingUser', JSON.stringify(state.listBookingUser));
        },
        setListBookingById: (state, action) => {
            const { id, data } = action.payload;
            const index = state.listBookingUser.findIndex((booking) => booking.id === id);
            if (index !== -1) {
              state.listBookingUser[index] = data;
            }
          },
        getListBookingById: (state, action) => {
            const { id } = action.payload;
            const index = state.listBookingUser.findIndex((booking) => booking.id === id);
            if (index !== -1) {
              return state.listBookingUser[index];
            }
        },
        updateStatusBooking: (state, action) => {
            const { id, status } = action.payload;
            const index = state.listBookingUser.findIndex((booking) => booking.id === id);
            if (index !== -1) {
              state.listBookingUser[index].status = status;
            }
          },
    }
    
})

export const { setListBookingUser,setListBookingById,getListBookingById, updateStatusBooking } = listBookingUser.actions;
export default listBookingUser.reducer