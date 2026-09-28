import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import rbacReducer from './slices/rbacSlice';
import dashboardFiltersReducer from './slices/dashboardFiltersSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    rbac: rbacReducer,
    dashboardFilters: dashboardFiltersReducer,
  },
});

export default store;
