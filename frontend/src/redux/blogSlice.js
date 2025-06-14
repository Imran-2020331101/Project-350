import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { nanoid } from "@reduxjs/toolkit";

/* global process */
export const fetchBlogs = createAsyncThunk("blogs/fetchPublic", async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_BACKEND_ADDRESS}/blogs`
  );
  return data;
});

const blogsSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    status: "idle",
    error: null,
  },
  reducers: {
    likeBlog: async (state, action) => {
      console.log("Like Blog reducer called");

      const blog = state.blogs.find((b) => b._id === action.payload);
      if (blog) {
        blog.likes = (blog.likes || 0) + 1;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/blogs`
      );
      return response.data;
    },

    addCommentToBlog: async (state, action) => {
      const { blogId, comment } = action.payload;
      const blog = state.blogs.find((b) => b._id === blogId);
      if (blog) {
        const newComment = {
          user: comment.user,
          text: comment.text,
          replies: [],
        };
        blog.comments = blog.comments || [];
        blog.comments.unshift(newComment);
        const { data } = await axios.post(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/blogs/${blogId}/comments`,
          comment
        );
        console.log(data);
        return data;
      }
    },

    addReplyToComment: (state, action) => {
      const { blogId, commentId, reply } = action.payload;
      const blog = state.blogs.find((b) => b._id === blogId);
      if (blog) {
        const comment = blog.comments?.find((c) => c._id === commentId);
        if (comment) {
          const newReply = {
            _id: nanoid(),
            user: reply.user,
            text: reply.text,
          };
          comment.replies = comment.replies || [];
          comment.replies.push(newReply);
        }
      }
    },
  },
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
      });
  },
});

export const { likeBlog, addCommentToBlog, addReplyToComment } =
  blogsSlice.actions;

export default blogsSlice.reducer;
