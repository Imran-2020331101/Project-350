import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null, 
  status: 'idle', 
  error: null,
  isSignedIn: false,
  token: null,
};

/* global process */
export const postUsers = createAsyncThunk('auth/login', async (user,{dispatch, rejectWithValue}) => {
  try {
    console.log('sending login request ');
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_ADDRESS}/auth/login`, user,{
      withCredentials:true,
    });
    
    const {accessToken, user:userData} = res.data;
    
    // dispatch(setUser({user:userData,token: accessToken}))

    console.log(userData , 'login success');

    return {user:userData,accessToken}; // Expecting a single user object or relevant auth data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});
 
export const registerUser = createAsyncThunk(
  'auth/register',
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_ADDRESS}/auth/register`, user);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isSignedIn = !!action.payload.user; // Update isSignedIn based on user presence
      state.status = 'success'; // Optionally update status
      state.error = null; // Clear any previous error
    },
    signedOut: (state) => {
      state.user = null;
      state.token = null;
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
        state.token = action.payload.accessToken;
        state.user = action.payload.user; // Store the logged-in user data
      })
      .addCase(postUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error;
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
export const selectAuthState = (state) => state.auth;

export const { setUser, signedOut, clearError } = authSlice.actions;
export default authSlice.reducer;