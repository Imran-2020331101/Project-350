import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* global process */
export const fetchUserPhotos = createAsyncThunk(
  "photo/fetchAll",
  async (userID, { rejectWithValue }) => {
    try {
      
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/photos/${userID}`
      );
      return data.photos;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Failed to fetch photos.");
    }
  }
);

export const postPhoto = createAsyncThunk(
  "photo/postPhoto",
  async (formData, { rejectWithValue }) => {
    try {
      const {data} = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(data)
      return data;
    } catch (err) {
      console.error(
        "Error uploading photo :",
        err.response?.data || err.message
      );
      return rejectWithValue(err.response?.data || "Unknown error");
    }
  }
);

const photoSlice = createSlice({
  name: "photos",
  initialState: {
    photos: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPhotos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserPhotos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.photos = action.payload;
      })
      .addCase(fetchUserPhotos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(postPhoto.fulfilled, (state, action) => {
        state.photos.push(action.payload.data);
      });
  },
});

export default photoSlice.reducer;
