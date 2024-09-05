import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
    appointments: {},
};

const appointment = createSlice({
    name: "appointment",
    initialState: INITIAL_STATE,
    reducers: {
        setAppointments(state, action) {
            state.appointments = action.payload;

            // Simpan data appointments ke AsyncStorage
            AsyncStorage.setItem('appointments', JSON.stringify(state.appointments));
        },
    },
});

export const { setAppointments } = appointment.actions;
export default appointment.reducer;