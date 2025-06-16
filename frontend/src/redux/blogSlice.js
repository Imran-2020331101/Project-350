import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* global process */

export const createBlog = createAsyncThunk(
  "groups/createBlog",
  async (blogData, { rejectWithValue }) => {
    try {
      console.log('Blog Data in thunk : ', blogData);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/groups`,
        blogData
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

export const fetchBlogs = createAsyncThunk("blogs/fetchPublic", async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_BACKEND_ADDRESS}/blogs`
  );
  return data;
});

export const createBlog = createAsyncThunk(
  "blogs/createBlog", 
  async (blogData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/blogs`,
        blogData
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Failed to create blog" });
    }
  }
);

export const likeBlog = createAsyncThunk("blogs/likeBlog", async (likeData) => {
  const {id:blogId, isBlogLiked} = likeData;
  console.log("from blogSlice : ", isBlogLiked)
  const { data } = await axios.post(
    `${process.env.REACT_APP_BACKEND_ADDRESS}/blogs/${blogId}/like`,
    {blogLiked: isBlogLiked}
  );
  return { blogId, likes: data.likes };
});

export const addCommentToBlog = createAsyncThunk(
  "blogs/addCommentToBlog",
  async ({ blogId, comment }) => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_ADDRESS}/blogs/${blogId}/comments`,
      comment
    );
    console.log("data. comments : ", data.comments);
    return { blogId, comment: data.comments };
  }
);

export const addReplyToComment = createAsyncThunk(
  "blogs/addReplyToComment",
  async ({ blogId, commentId, reply }) => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_ADDRESS}/blogs/${blogId}/comments/${commentId}/replies`,
      reply
    );
    console.log("comments after reply : ", data.comments);
    return { blogId, comment: data.comments };
  }
);

const blogsSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogs = action.payload.blogs;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        const { blogId, likes } = action.payload;
        const blog = state.blogs.find((b) => b._id === blogId);
        if (blog) {
          blog.likes = likes;
        }      })
      .addCase(createBlog.pending, (state) => {
        state.status = "creating";
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogs.unshift(action.payload.blog); // Add new blog to the beginning
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || "Failed to create blog";
      })
      .addCase(addCommentToBlog.fulfilled, (state, action) => {
        const { blogId, comment } = action.payload;
        const blog = state.blogs.find((b) => b._id === blogId);
        if (blog) {
          blog.comments = comment;
        }
      })
      .addCase(addReplyToComment.fulfilled, (state, action) => {
        const { blogId, comment } = action.payload;
        const blog = state.blogs.find((b) => b._id === blogId);
        if (blog) {
          blog.comments = comment;
        }
      });
  },
});

export default blogsSlice.reducer;
