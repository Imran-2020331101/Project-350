// features/groupSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
/*global process*/
export const fetchGroups = createAsyncThunk("groups/fetchGroups", async () => {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_ADDRESS}/groups`);
  return response.data;
});

const groupSlice = createSlice({
  name: "groups",
  initialState: {
    groups: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default groupSlice.reducer;
