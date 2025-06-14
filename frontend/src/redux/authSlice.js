import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null, 
  status: 'idle', 
  error: null,
  isSignedIn: false,
  token: null,
  limit: 1,
};

/* global process */
export const postUsers = createAsyncThunk('auth/login', async (user,{rejectWithValue}) => {
  try {
    console.log('sending login request ');
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_ADDRESS}/auth/login`, user,{
      withCredentials:true,
    });
    
    const {accessToken, user:userData} = res.data;
    
    return {user:userData,accessToken}; 
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

export const fetchUserPhotos = createAsyncThunk(
  'auth/photos',
  async (userID, { rejectWithValue }) => {
    try {
      console.log(userID);
      const {data} = await axios.get(`${process.env.REACT_APP_BACKEND_ADDRESS}/images/${userID}`);
      console.log(data);
      return {data};
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Failed to fetch Images.');
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
      state.isSignedIn = !!action.payload.user; 
      state.status = 'success'; 
      state.error = null; 
    },
    signedOut: (state) => {
      state.user = null;
      state.token = null;
      state.isSignedIn = false;
      state.status = 'idle'; 
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null; 
      })
      .addCase(postUsers.fulfilled, (state, action) => {
        state.status = 'success';
        state.isSignedIn = true;
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(postUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error;
        state.isSignedIn = false;
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'success';
        state.isSignedIn = false;
        state.user = null;
        state.token = null;
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