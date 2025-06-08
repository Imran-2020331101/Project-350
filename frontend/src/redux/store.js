import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tripReducer from './tripSlice';
import blogsReducer from './blogSlice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripReducer,
    blogs: blogsReducer,
  },
});
export default store;
