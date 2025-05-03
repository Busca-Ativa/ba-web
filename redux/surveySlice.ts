// surveySlice.ts

import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialSurveyState = {
  surveyJson: {
    title: "",
    tags: [],
    description: "",
    completedHtml: "<h3>Thank you for your feedback</h3>",
    completedHtmlOnCondition: [
      {
        html: "<h3>Thank you for your feedback</h3> <h4>We are glad that you love our product. Your ideas and suggestions will help us make it even better.</h4>",
      },
      {
        html: "<h3>Thank you for your feedback</h3> <h4>We are glad that you shared your ideas with us. They will help us make our product better.</h4>",
      },
    ],
    pages: [
      {
        name: "page1",
        elements: [],
      },
    ],
    showQuestionNumbers: "off",
  },
  tags: [],
  formName: "",
  formDescription: "",
  createdAt: "",
  updatedAt: "",
  status: "undone",
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
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setUpdatedAt: (state, action) => {
      state.updatedAt = action.payload;
    },
    setCreatedAt: (state, action) => {
      state.createdAt = action.payload;
    },
    addElement: (state, action) => {
      const { pageIndex, element } = action.payload;
      console.log("addElement data: ", element);
      if (state.surveyJson.pages[pageIndex]) {
        if (!state.surveyJson.pages[pageIndex].elements) {
          state.surveyJson.pages[pageIndex].elements = [];
        }

        // Generate a unique UUID for the new element
        const newElement = { ...element, id: uuidv4() };

        (state.surveyJson.pages[pageIndex].elements as any[]).push(newElement);
      }
    },
    removeElement: (state, action) => {
      const { pageIndex, elementIndex } = action.payload;
      if (
        state.surveyJson.pages[pageIndex] &&
        state.surveyJson.pages[pageIndex].elements[elementIndex]
      ) {
        state.surveyJson.pages[pageIndex].elements.splice(elementIndex, 1);
      }
    },
    removeAllElements: (state, action) => {
      const { pageIndex } = action.payload;
      if (state.surveyJson.pages[pageIndex]) {
        state.surveyJson.pages[pageIndex].elements = [];
      }
    },
    updateElement: (
      state,
      action: {
        payload: {
          pageIndex: number;
          elementIndex: number;
          updatedElement: any;
        };
      }
    ) => {
      const { pageIndex, elementIndex, updatedElement } = action.payload;
      console.log("updateElement", updatedElement);
      if (
        state.surveyJson.pages[pageIndex] &&
        state.surveyJson.pages[pageIndex].elements[elementIndex]
      ) {
        (state.surveyJson.pages[pageIndex].elements[elementIndex] as any) =
          updatedElement;
      }
    },
    updateQuestionOrder: (state, action) => {
      const { pageIndex, questionIndex, direction } = action.payload;
      console.log(pageIndex, questionIndex, direction);
      if (state.surveyJson.pages[pageIndex]) {
        const elements = state.surveyJson.pages[pageIndex].elements;
        if (
          elements.length === 0 ||
          questionIndex < 0 ||
          questionIndex >= elements.length
        ) {
          return; // No changes if index is out of bounds
        }
        const swapElementFrom = elements[questionIndex];
        if (direction === "down") {
          if (questionIndex < elements.length) {
            const swapElementTo = elements[questionIndex + 1];
            elements[questionIndex] = swapElementTo;
            elements[questionIndex + 1] = swapElementFrom;
          } else {
            return;
          }
        } else if (direction === "up") {
          if (questionIndex > 0) {
            const swapElementTo = elements[questionIndex - 1];
            elements[questionIndex] = swapElementTo;
            elements[questionIndex - 1] = swapElementFrom;
          } else {
            return;
          }
        }
        state.surveyJson.pages[pageIndex].elements = elements;
      }
    },
    duplicateElement: (state, action) => {
      const { pageIndex, elementIndex } = action.payload;
      if (
        state.surveyJson.pages[pageIndex] &&
        state.surveyJson.pages[pageIndex].elements[elementIndex]
      ) {
        const elementToDuplicate: Object =
          state.surveyJson.pages[pageIndex].elements[elementIndex];
        const duplicatedElement = { ...elementToDuplicate };
        (state.surveyJson.pages[pageIndex].elements as any).splice(
          elementIndex + 1,
          0,
          duplicatedElement
        );
      }
    },
    setElementRequired: (state, action) => {
      const { pageIndex, elementIndex } = action.payload;
      if (
        state.surveyJson.pages[pageIndex] &&
        state.surveyJson.pages[pageIndex].elements[elementIndex]
      ) {
        const element =
          state.surveyJson.pages[pageIndex].elements[elementIndex];
        (element as any).isRequired = !(element as any).isRequired;
      }
    },
  },
});

export const {
  setFormName,
  setFormDescription,
  setSurveyJson,
  setStatus,
  setUpdatedAt,
  setCreatedAt,
  addElement,
  updateElement,
  removeElement,
  updateQuestionOrder,
  duplicateElement,
  removeAllElements,
  setElementRequired,
} = surveySlice.actions;

export const selectAllElements: any = (state: any) => {
  return state.survey.surveyJson.pages.flatMap(
    (page: any) => (page as any).elements
  );
};

export default surveySlice.reducer;

export const initialState = initialSurveyState;
