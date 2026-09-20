/**
 * @file rbacSlice.js
 * @module store/slices/rbac
 * @description Redux Toolkit slice that stores the current user's RBAC data
 * (roles, permissions and a summary) in the Redux store.  Populated after
 * a successful login or session restore; cleared on logout.
 */

import { createSlice } from '@reduxjs/toolkit';
import { clearStore } from '../actions/clearStoreAction';

/**
 * @typedef {object} RbacSummary
 * @property {number} total_roles       - Total number of roles assigned.
 * @property {number} total_permissions - Total number of permissions granted.
 * @property {string[]} role_names      - Display names of the assigned roles.
 */

/**
 * @typedef {object} RbacState
 * @property {object[]}    roles       - List of role objects assigned to the user.
 * @property {object[]}    permissions - List of permission objects granted to the user.
 * @property {RbacSummary} summary     - Aggregated RBAC summary.
 */

/** @type {RbacState} */
const initialState = {
  roles: [],
  permissions: [],
  summary: {
    total_roles: 0,
    total_permissions: 0,
    role_names: [],
  },
};

const rbacSlice = createSlice({
  name: 'rbac',
  initialState,
  reducers: {
    /**
     * Populates the RBAC slice with data returned from the server.
     *
     * @param {RbacState} state
     * @param {{ payload: Partial<RbacState> }} action
     */
    setRbac: (state, action) => {
      const { roles, permissions, summary } = action.payload;
      state.roles = roles || [];
      state.permissions = permissions || [];
      state.summary = summary || initialState.summary;
    },
    /**
     * Resets the RBAC slice to its initial empty state.
     * Called on logout or session expiry.
     *
     * @param {RbacState} state
     */
    clearRbac: (state) => {
      state.roles = [];
      state.permissions = [];
      state.summary = {
        total_roles: 0,
        total_permissions: 0,
        role_names: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearStore, () => initialState);
  },
});

export const { setRbac, clearRbac } = rbacSlice.actions;
export default rbacSlice.reducer;
