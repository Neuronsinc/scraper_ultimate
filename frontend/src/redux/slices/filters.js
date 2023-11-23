import { filter, map } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
    filters: [{
        id: 0,
        D: ["Invalid Date", "Invalid Date"],
        pais: [{ title: 'Guatemala', id: 1 }],
        localizacion: null,
        categoria: [],
        tableData: [],
        actual: true
    }],
    order: 'reverse'
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
            // Clonar el array actual de filtros
            const updatedFilters = [...state.filters];
            // Agregar el nuevo filtro al inicio del array
            updatedFilters.unshift(newFilter);
            // Actualizar el estado con el nuevo array de filtros
            state.filters = updatedFilters;
        },
        // Delete element to filter
        DeleteFilter(state, action) {
            const { filterId } = action.payload;
            const deletefilter = filter(state.filters, (filter) => filter.id !== filterId);
            state.filters = deletefilter;
        },
        // Delete various filters
        DeleteVariousFilters(state, action) {
            const Ids = action.payload;
            const deleteVarious = state.filters.filter(item => !Ids.includes(item.id));
            state.filters = deleteVarious;
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
        // Update all filter element
        UpdateAllFilter(state, action) {
            const filters = action.payload;
            state.filters = filters;
        },
        // Update order to filter
        UpdateOrder(state, action) {
            const order = action.payload;
            state.order = order;
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
export const { AddFilter, UpdateFilter, DeleteFilter, DeleteVariousFilters, UpdateOrder, UpdateAllFilter } = slice.actions;

