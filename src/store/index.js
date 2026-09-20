import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import rbacReducer from './slices/rbacSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    rbac: rbacReducer,
  },
});

export default store;
