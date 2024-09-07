import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./users";
import barbershopsReducer from "./barbershops";
import profileDataReducer from "./profileData";
import appointmentReducer from "./appointment";
import listBookingUserReducer from "./listBookingUser";

const store= configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
    reducer:{
        user: userReducer,
        barbershops: barbershopsReducer,
        profileData: profileDataReducer,
        appointment: appointmentReducer,
        listBookingUser: listBookingUserReducer,
        
    }
})

export default store