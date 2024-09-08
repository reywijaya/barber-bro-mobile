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
      AsyncStorage.setItem('loggedInUser', JSON.stringify(state.loggedInUser));
    },
    logout(state) {
      state.loggedInUser = {};
      AsyncStorage.removeItem('loggedInUser');
    },
    edit(state, action) {
      state.loggedInUser = action.payload;
      AsyncStorage.setItem('loggedInUser', JSON.stringify(state.loggedInUser));
    },
  },
});

export const { login, logout } = users.actions;
export default users.reducer;
