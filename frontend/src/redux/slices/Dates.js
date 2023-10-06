import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  D: [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31)]
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
    }
    
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { changeDates } = slice.actions;

// ----------------------------------------------------------------------

// export function getAllPosts() {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get('/api/blog/posts/all');
//       dispatch(slice.actions.getPostsSuccess(response.data.posts));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

// ----------------------------------------------------------------------

