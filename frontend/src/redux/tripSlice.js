import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = 'http://localhost:3000/api/v1';

export const fetchTrips = createAsyncThunk('trips/fetchTrips', async () => {
  try {
    const response = await axios.get('/api/trips');
    return response.data;
  } catch (error) {
    return error.message;
  }
});

export const postTrip = createAsyncThunk('trips/postTrip', async (trip) => {
  try {
    const response = await axios.post(`${baseUrl}/itinerary`, trip);
    return response.data;
  } catch (error) {
    return error.message;
  }
});

const initialState = {
  trips: [],
  status: 'loading',
  error: null,
};

const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    addTrip: {
      reducer(state, action) {},
      prepare(trip) {
        return {
          payload: {},
        };
      },
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTrips.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trips = state.trips.concat(action.payload);
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(postTrip.fulfilled, (state, action) => {
        // state.trips.push(action.payload);
        console.log(action.payload);
      });
  },
});

export const { addTrip } = tripSlice.actions;
export default tripSlice.reducer;

const selectAllTrips = (state) => state.trips.trips;
