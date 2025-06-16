// src/features/trips/tripsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/* global process */ 
export const fetchTrips = createAsyncThunk(
  'trips/fetchAll',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/trips/${userId}`
      );
      
      return data.trips;
    } catch (err) {
      console.error('Error fetching trips:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data || 'Unknown error');
    }
  }
);



export const postTrip = createAsyncThunk(
  'trips/postTrip',
  async (newTrip, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_ADDRESS}/trips`, newTrip);
      return response.data;
    } catch (err) {
      console.error('Error creating trip:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data || 'Failed to create trip');
    }
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
      })      .addCase(fetchTrips.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(postTrip.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postTrip.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trips.push(action.payload.trip); 
      })
      .addCase(postTrip.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});
 
export default tripsSlice.reducer;
