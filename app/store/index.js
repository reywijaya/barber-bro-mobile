import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./users";
import barbershopsReducer from "./barbershops";
import profileDataReducer from "./profileData";
import appointmentReducer from "./appointment";

const store= configureStore({
    reducer:{
        user: userReducer,
        barbershops: barbershopsReducer,
        profileData: profileDataReducer,
        appointment: appointmentReducer
    }
})

export default store