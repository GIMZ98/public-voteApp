import { configureStore } from "@reduxjs/toolkit";
import addressReducer from '../features/addressSlicer'

export const store = configureStore({
    reducer:{
        address: addressReducer,
    }
})