// surveySlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialSurveyState = {
  surveyJson: {
    title: "",
    description: "",
    completedHtml: "<h3>Thank you for your feedback</h3>",
    completedHtmlOnCondition: [
      {
        html: "<h3>Thank you for your feedback</h3> <h4>We are glad that you love our product. Your ideas and suggestions will help us make it even better.</h4>"
      },
      {
        html: "<h3>Thank you for your feedback</h3> <h4>We are glad that you shared your ideas with us. They will help us make our product better.</h4>"
      }
    ],
    pages: [
      {
        name: "page1",
        elements: []
      }
    ],
    showQuestionNumbers: "off"
  },
  formName: "",
  formDescription: "",
  tags: []
};

const surveySlice = createSlice({
  name: "survey",
  initialState: initialSurveyState,
  reducers: {
    setFormName: (state, action) => {
      state.formName = action.payload;
      state.surveyJson.title = action.payload;
    },
    setFormDescription: (state, action) => {
      state.formDescription = action.payload;
      state.surveyJson.description = action.payload;
    },
    setSurveyJson: (state, action) => {
      state.surveyJson = action.payload || initialSurveyState.surveyJson;
    },
    setTags: (state, action) => {
      state.tags = action.payload;
    },
    addElement: (state, action) => {
      const { pageIndex, element } = action.payload;
      if (state.surveyJson.pages[pageIndex]) {
        state.surveyJson.pages[pageIndex].elements.push(element);
      }
    },
    removeElement: (state, action) => {
      const { pageIndex, elementIndex } = action.payload;
      if (state.surveyJson.pages[pageIndex] && state.surveyJson.pages[pageIndex].elements[elementIndex]) {
        state.surveyJson.pages[pageIndex].elements.splice(elementIndex, 1);
      }
    },
    updateElement: (state, action) => {
      const { pageIndex, elementIndex, updatedElement } = action.payload;
      if (state.surveyJson.pages[pageIndex] && state.surveyJson.pages[pageIndex].elements[elementIndex]) {
        state.surveyJson.pages[pageIndex].elements[elementIndex] = updatedElement;
      }
    }
  }
});

export const {
  setFormName,
  setFormDescription,
  setSurveyJson,
  setTags,
  addElement,
  updateElement,
  removeElement
} = surveySlice.actions;

export default surveySlice.reducer;
