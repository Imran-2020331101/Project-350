// features/groupSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
/*global process*/

export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (_, { getState }) => {
    const state = getState();
    const userId = state.auth.user?._id;

    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_ADDRESS}/groups${
        userId ? `?userId=${userId}` : ""
      }`
    );
    return response.data;
  }
);

export const bookGroup = createAsyncThunk(
  "groups/bookGroup",
  async ({ groupId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/groups/${groupId}/join`,
        { userId }
      );
      return response.data;
    } catch (error) {
      console.error("Error in bookGroup thunk:", error);
      console.log("Axios error response:", error.response);
      console.log("Axios error response data:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to book group"
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "groups/cancelBooking",
  async ({ groupId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/groups/${groupId}/cancel`,
        { userId }
      );
      return response.data;
    } catch (error) {
      console.error("Error in cancelBooking thunk:", error);
      console.log("Axios error response:", error.response);
      console.log("Axios error response data:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to cancel booking"
      );
    }
  }
);

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (groupData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/groups`,
        groupData
      );
      return data;
    } catch (error) {
      console.log("Error creating Group:", error);
      return rejectWithValue(
        error.response?.data?.error || "Failed to cancel booking"
      );
    }
  }
);

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
      })
      .addCase(bookGroup.fulfilled, (state, action) => {
        console.log("bookGroup.fulfilled - action.payload:", action.payload);
        state.groups = state.groups.map((group) =>
          group._id === action.payload.group._id
            ? {
                ...group,
                availableSpots: action.payload.group.availableSpots,
                isBooked: action.payload.isBooked,
              }
            : group
        );
        console.log(
          "bookGroup.fulfilled - updated state.groups:",
          state.groups
        );
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        console.log(
          "cancelBooking.fulfilled - action.payload:",
          action.payload
        );
        state.groups = state.groups.map((group) =>
          group._id === action.payload.group._id
            ? {
                ...group,
                availableSpots: action.payload.group.availableSpots,
                isBooked: action.payload.isBooked,
              }
            : group
        );
        console.log(
          "cancelBooking.fulfilled - updated state.groups:",
          state.groups
        );
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        const {createdGroup} = action.payload;
        state.groups = state.groups || [];
        state.groups.unshift(createdGroup);
      });
  },
});

export default groupSlice.reducer;
