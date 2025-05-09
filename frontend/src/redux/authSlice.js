import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {dummyUser} from '../DemoInfo/User'

const baseUrl = 'http://localhost:3000/api/v1';

const initialState = {
  user: dummyUser, 
  status: 'idle', 
  error: null,
  isSignedIn: true,
};

export const postUsers = createAsyncThunk('auth/login', async (user) => {
  try {
    console.log('testing login');
    const response = await axios.post(`${baseUrl}/auth/login`, user);
    console.log(response, 'login success');
    return response.data; // Expecting a single user object or relevant auth data
  } catch (error) {
    return error.message;
  }
});

export const registerUser = createAsyncThunk(
  'auth/register',
  async (user) => {
    try {
      console.log('registering user');
      const response = await axios.post(`${baseUrl}/auth/register`, user);
      console.log(response, 'registration success');
      return response.data; // Expecting a single user object or relevant registration data
    } catch (error) {
      return error.message;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isSignedIn = !!action.payload; // Update isSignedIn based on user presence
      state.status = 'success'; // Optionally update status
      state.error = null; // Clear any previous error
    },
    signedOut: (state) => {
      state.user = null;
      state.isSignedIn = false;
      state.status = 'idle'; // Reset status on sign out
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Clear any previous error
      })
      .addCase(postUsers.fulfilled, (state, action) => {
        state.status = 'success';
        state.isSignedIn = true;
        state.user = action.payload; // Store the logged-in user data
      })
      .addCase(postUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isSignedIn = false;
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Clear any previous error
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'success';
        // Optionally sign in the user after successful registration
        // state.isSignedIn = true;
        state.user = action.payload; // Store the registered user data
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isSignedIn = false;
        state.user = null;
      });
  },
});

export const selectStatus = (state) => state.auth.status;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsSignedIn = (state) => state.auth.isSignedIn;
export const selectAuthError = (state) => state.auth.error;

export const { setUser, signedOut, clearError } = authSlice.actions;
export default authSlice.reducer;