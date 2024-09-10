// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import surveyReducer from './surveySlice';

const store = configureStore({
    reducer: {
        survey: surveyReducer,
    },
});

export default store;
