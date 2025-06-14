// src/features/trips/tripsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/* global process */
export const fetchTrips = createAsyncThunk(
  'trips/fetchAll',
  async (userId, { rejectWithValue }) => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_ADDRESS}/trips/${userId}`;
      console.log('👉 Requesting:', url);
      const response = await axios.get(url,{
        withCredentials:true,
      });
      return response.data;
    } catch (err) {
      console.error('❌ Error fetching trips:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data || 'Unknown error');
    }
  }
);




export const postTrip = createAsyncThunk(
  'trips/postTrip',
  async (newTrip) => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_ADDRESS}/trips`, newTrip);
    return response.data;
  }
);


const tripsSlice = createSlice({
  name: 'trips',
  initialState: {
    trips: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(postTrip.fulfilled, (state, action) => {
        state.trips.push(action.payload); // Add the new trip to the list
      });
  },
});
 
export default tripsSlice.reducer;
