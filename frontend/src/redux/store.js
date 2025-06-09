// src/redux/store.js

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tripReducer from './tripSlice';
import blogsReducer from './blogSlice';
import groupReducer from './groupSlice';

import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

// Combine all slices
const rootReducer = combineReducers({
  auth: authReducer,
  trips: tripReducer,
  blogs: blogsReducer,
  groups: groupReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['blogs', 'trips', 'groups'], // persist only selected slices
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist needs this turned off
    }),
});

// Create persistor
export const persistor = persistStore(store);

export default store;
