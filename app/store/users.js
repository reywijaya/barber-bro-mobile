import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  loggedInUser: {},
};

const users = createSlice({
  name: 'user',
  initialState: INITIAL_STATE,
  reducers: {
    login(state, action) {
      state.loggedInUser = action.payload;

      // Simpan data loggedInUser ke AsyncStorage
      AsyncStorage.setItem('loggedInUser', JSON.stringify(state.loggedInUser));
    },
    logout(state) {
      state.loggedInUser = {};

      // Hapus data loggedInUser dari AsyncStorage
      AsyncStorage.removeItem('loggedInUser');
    },
    edit(state, action) {
      state.loggedInUser = action.payload;

      // Simpan data loggedInUser ke AsyncStorage
      AsyncStorage.setItem('loggedInUser', JSON.stringify(state.loggedInUser));
    },
  },
});

export const { login, logout, edit } = users.actions;
export default users.reducer;
