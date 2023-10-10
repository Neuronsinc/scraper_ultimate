import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  D: ["Invalid Date", "Invalid Date"]
};

const slice = createSlice({
  name: 'Dates',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    changeDates(state, action) {
      state.isLoading = false;
      state.D = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { changeDates } = slice.actions;

