/**
 * Shared action to clear entire Redux store
 * This action is listened to by all slices via extraReducers
 *
 * Using createAction from Redux Toolkit for type safety and best practices
 * Action type: 'app/clearStore' (follows Redux naming convention)
 */
import { createAction } from '@reduxjs/toolkit';

export const clearStore = createAction('app/clearStore');
