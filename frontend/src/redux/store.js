import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tripReducer from './tripSlice';
import blogsReducer from './blogSlice'
import groupReducer from './groupSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripReducer,
    blogs: blogsReducer,
    groups: groupReducer,
  },
});
export default store;
