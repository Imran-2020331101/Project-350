// src/redux/store.js

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tripReducer from './tripSlice';
import blogsReducer from './blogSlice';
import groupReducer from './groupSlice';
import photoReducer from './photoSlice'

import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer, createTransform } from 'redux-persist';

// Combine all slices
const rootReducer = combineReducers({
  auth: authReducer,
  trips: tripReducer,
  blogs: blogsReducer,
  groups: groupReducer,
  photos: photoReducer
});


const authTransform = createTransform(
  (inboundState) => ({
    user: inboundState.user,
    isSignedIn: inboundState.isSignedIn,
  }),
  (outboundState) => outboundState,
  { whitelist: ['auth'] }
);

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'blogs', 'trips', 'groups','photos'],
  transforms: [authTransform],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

// Create persistor
export const persistor = persistStore(store);

export default store;
