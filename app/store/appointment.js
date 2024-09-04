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
        },
    },
});

export const { setAppointments } = appointment.actions;
export default appointment.reducer;