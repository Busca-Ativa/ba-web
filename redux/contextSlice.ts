// surveySlice.ts

import { createSlice } from "@reduxjs/toolkit";

const initialContextState = {
  entity: {
    name: "",
    type: "",
  },
  user: {
    name: "",
    role: "",

  }
};

const contextSlice = createSlice({
  name: "contex",
  initialState: initialContextState,
  reducers: {
    setUserData: (state, action) => {
      const { name ,role } = action.payload
      state.user.name = name;
      state.user.role = role
    },
    setEntityData: (state, action) => {
      const { name, type } = action.payload;
      state.entity.name = name;
      state.entity.type = type;
    },
  }
});

export const {
  setUserData,
  setEntityData,
} = contextSlice.actions;

export default contextSlice.reducer;

export const initialState = initialContextState;
