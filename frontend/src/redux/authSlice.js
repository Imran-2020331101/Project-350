import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import axios, { all } from 'axios';

const baseUrl = 'http://localhost:3000/api/v1';

const initialState = {
  users: [],
  status: 'pending',
  error: null,
  isSignedIn: false,
};
export const postUsers = createAsyncThunk('auth/postUsers ', async (user) => {
  try {
    console.log('testing ');
    const response = await axios.post(`${baseUrl}/auth/login`, user);
    console.log(response, 'success');
    console.log('fetching posts');
    return [...response.data];
  } catch (error) {
    return error.message;
  }
});

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (user) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/register`, user);
      console.log(response, 'success');
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addUser: {
      reducer: (state, action) => {
        state.users.push(action.payload);
      },
      prepare: (email, password) => {
        return { payload: { email, password } };
      },
    },
    signedOut: {
      reducer: (state, action) => {
        state.isSignedIn = false;
      },
      prepare: () => {
        return { payload: {} };
      },
    },
  },
  extraReducers(builder) {
    builder
      .addCase(postUsers.pending, (state, action) => {
        state.status = 'loading...';
      })
      .addCase(postUsers.fulfilled, (state, action) => {
        state.status = 'success';
        state.isSignedIn = true;
      });
  },
});

export const status = (state) => state.auth.status;
export const allUsers = (state) => state.auth.users;
export const signedIn = (state) => state.auth.isSignedIn;
export const { addUser, signedOut } = userSlice.actions;
export default userSlice.reducer;
