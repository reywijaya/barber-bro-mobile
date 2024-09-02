import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./users";
import barbershopsReducer from "./barbershops";

const store= configureStore({
    reducer:{
        user: userReducer,
        barbershops: barbershopsReducer
    }
})

export default store