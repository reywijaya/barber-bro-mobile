import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  barbershops: [],
  barbershopById: {},
};

const barbershopSlice = createSlice({
  name: "barbershop",
  initialState,
  reducers: {
    getBarbershops: (state, action) => {
      state.barbershops = action.payload;
      // Simpan data barbershops ke AsyncStorage
      AsyncStorage.setItem('barbershops', JSON.stringify(state.barbershops));
    },
    getBarbershopById: (state, action) => {
      state.barbershopById = action.payload;
      // Simpan data barbershopById ke AsyncStorage
      AsyncStorage.setItem('barbershopById', JSON.stringify(state.barbershopById));
    },
    loadBarbershopsFromStorage: (state, action) => {
      state.barbershops = action.payload || [];
    },
    loadBarbershopByIdFromStorage: (state, action) => {
      state.barbershopById = action.payload || {};
    },
  },
});

export const {
  getBarbershops,
  getBarbershopById,
  loadBarbershopsFromStorage,
  loadBarbershopByIdFromStorage,
} = barbershopSlice.actions;

// Thunk untuk mengambil data barbershops dari AsyncStorage saat aplikasi dimulai
export const fetchBarbershopsFromStorage = () => async dispatch => {
  try {
    const barbershops = await AsyncStorage.getItem('barbershops');
    if (barbershops !== null) {
      dispatch(loadBarbershopsFromStorage(JSON.parse(barbershops)));
    }
  } catch (error) {
    console.error('Failed to load barbershops from storage:', error);
  }
};

// Thunk untuk mengambil data barbershopById dari AsyncStorage saat aplikasi dimulai
export const fetchBarbershopByIdFromStorage = () => async dispatch => {
  try {
    const barbershopById = await AsyncStorage.getItem('barbershopById');
    if (barbershopById !== null) {
      dispatch(loadBarbershopByIdFromStorage(JSON.parse(barbershopById)));
    }
  } catch (error) {
    console.error('Failed to load barbershop by id from storage:', error);
  }
};

export default barbershopSlice.reducer;
