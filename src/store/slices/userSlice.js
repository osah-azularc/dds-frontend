/**
 * @file userSlice.js
 * @module store/slices/user
 * @description Redux Toolkit slice that stores the currently authenticated
 * user's profile fields in the Redux store.  Populated after a successful
 * login or session restore; cleared on logout.
 */

import { createSlice } from '@reduxjs/toolkit';
import { clearStore } from '../actions/clearStoreAction';

/**
 * @typedef {object} UserState
 * @property {boolean} isAuthenticated - Whether the current client session is authenticated.
 * @property {string|null} email     - The user's email address.
 * @property {number|null} userId    - The user's unique identifier.
 * @property {string|null} firstName - The user's first name.
 * @property {string|null} lastName  - The user's last name.
 * @property {string|null} userType  - The user's type / role category.
 * @property {number|null} review_form1s - Whether user can review Form 1s (chief clerk flag).
 * @property {string|null} isActiveBilling - '1' when the user has active-billing access
 *   (gates Admin > Time & Expense Invoicing, mirroring legacy's is_active_billing check).
 * @property {string[]} permissions - RBAC permission names granted to the user (e.g. 'home.view').
 */

/** @type {UserState} */
const initialState = {
  isAuthenticated: false,
  email: null,
  user_id: null,
  FirstName: null,
  LastName: null,
  user_type: null,
  isAdmin: null,
  isActiveBilling: null,
  review_form1s: null,
  permissions: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Populates the user slice with profile data returned from the server.
     *
     * @param {UserState} state
     * @param {{ payload: Partial<UserState> }} action
     */
    setUser: (state, action) => {
      const {
        email,
        user_id,
        FirstName,
        LastName,
        user_type,
        isAdmin,
        isActiveBilling,
        review_form1s,
        permissions,
      } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        email,
        userId: user_id,
        user_id,
        firstName: FirstName,
        FirstName,
        lastName: LastName,
        LastName,
        userType: user_type,
        user_type,
        isAdmin,
        isActiveBilling,
        review_form1s,
        permissions: permissions || [],
      };
    },
    /**
     * Resets the user slice to its initial null state.
     * Called on logout or session expiry.
     *
     * @param {UserState} state
     */
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.email = null;
      state.userId = null;
      state.firstName = null;
      state.lastName = null;
      state.userType = null;
      state.review_form1s = null;
      state.permissions = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearStore, () => initialState);
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
