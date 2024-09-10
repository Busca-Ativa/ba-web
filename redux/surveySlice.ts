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
  createdAt: "",
  updatedAt: "",
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
    setStatusTag: (state, action) => {
      if (state.tags.length < 1){
        state.tags.push(action.payload);
        return;
      }
      state.tags[1] = action.payload;
    },
    setUpdatedAt: (state, action) => {
      state.updatedAt = action.payload;
    },
    setCreatedAt: (state, action) => {
      state.createdAt = action.payload;
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
    },
    updateQuestionOrder: (state, action) => {
      const { pageIndex, questionIndex, direction } = action.payload;
      console.log(pageIndex, questionIndex, direction);
      if (state.surveyJson.pages[pageIndex]) {
        const elements = state.surveyJson.pages[pageIndex].elements
        if (elements.length === 0 || questionIndex < 0 || questionIndex >= elements.length) {
          return ; // No changes if index is out of bounds
        }
        const swapElementFrom = elements[questionIndex]
        if (direction === 'down') {
          if (questionIndex < elements.length) {
            const swapElementTo = elements[questionIndex + 1]
            elements[questionIndex] = swapElementTo;
            elements[questionIndex + 1] = swapElementFrom;
          } else {
            return;
          }
        } else if (direction === 'up') {
          if (questionIndex > 0) {
            const swapElementTo = elements[questionIndex - 1]
            elements[questionIndex] = swapElementTo;
            elements[questionIndex - 1] = swapElementFrom;
          } else {
            return;
          }
        }
        state.surveyJson.pages[pageIndex].elements = elements;
      }
    }
  }
});

export const {
  setFormName,
  setFormDescription,
  setSurveyJson,
  setTags,
  setStatusTag,
  setUpdatedAt,
  setCreatedAt,
  addElement,
  updateElement,
  removeElement,
  updateQuestionOrder
} = surveySlice.actions;

export default surveySlice.reducer;
