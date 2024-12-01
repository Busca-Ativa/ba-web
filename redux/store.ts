// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import surveyReducer from './surveySlice';
import contextReducer from './contextSlice';

const store = configureStore({
    reducer: {
        survey: surveyReducer,
        context: contextReducer,
    },
});

export default store;
