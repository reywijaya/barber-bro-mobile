import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  loggedInUser: {},
  message: "Hello Gosling 3",
};

const users = createSlice({
  name: 'user',
  initialState: INITIAL_STATE,
  reducers: {
    login(state, action) {
      state.loggedInUser = action.payload;
    },
    logout(state) {
      state.loggedInUser = {};
    },
    edit(state, action) {
      state.loggedInUser = action.payload;
    },
  },
});

export const { login, logout, edit } = users.actions;
export default users.reducer;
