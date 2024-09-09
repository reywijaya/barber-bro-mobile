import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  loggedInUser: null,
};

const users = createSlice({
  name: 'user',
  initialState: INITIAL_STATE,
  reducers: {
    login: (state, action) => {
      state.loggedInUser = action.payload;
    },
    logout: (state) => {
      state.loggedInUser = null;
    },
  },
});

export const { login, logout } = users.actions;
export default users.reducer;
