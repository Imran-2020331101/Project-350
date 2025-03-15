import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tripReducer from './tripSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripReducer,
  },
});
export default store;
