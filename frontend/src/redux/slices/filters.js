import { filter, map } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
    filters: [{
        id: 0,
        D: ["Invalid Date", "Invalid Date"],
        pais: 1,
        localizacion: [],
        categoria: [],
        tableData: [],
        actual: true
    }]
};

const slice = createSlice({
    name: 'Filters',
    initialState,
    reducers: {
        // START LOADING
        startLoading(state) {
            state.isLoading = true;
        },
        // ADD element to filter 
        AddFilter(state, action) {
            const newFilter = action.payload;
            state.filters = [...state.filters, newFilter];
        },
        // Delete element to filter
        DeleteFilter(state, action) {
            const { filterId } = action.payload;
            const deletefilter = filter(state.filters, (filter) => filter.id !== filterId);
            state.filters = deletefilter;
        },
        // Update element to filter
        UpdateFilter(state, action) {
            const filter = action.payload;
            const updatefilter = map(state.filters, (_filter) => {
                if (_filter.id === filter.id) {
                    return filter;
                }
                return _filter;
            });
            state.filters = updatefilter;
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
export const { AddFilter, UpdateFilter, DeleteFilter } = slice.actions;

