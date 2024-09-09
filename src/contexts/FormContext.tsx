import React, { createContext, useState, ReactNode } from 'react';
import { Question } from "@/types/Question";
import { SurveySchema } from "@/types/Survey";

interface FormData {
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  survey: SurveySchema;
}

interface FormContextType {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: string) => void;
  updateQuestionOrder: (pageIndex: number, questionIndex: number, direction: "up" | "down") => void;
  getQuestionByIndex: (pageIndex:number, questionIndex: number) => Question | undefined;
}

const initialFormData: FormData = {
  name: '',
  description: '',
  created_at: '',
  updated_at: '',
  tags: [],
  survey: {
    title: "",
    description: "",
    pages: []
  }
};



export const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider = ({ children }: FormProviderProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => {
      const keys = key.split('.');
      let updatedFormData: any = { ...prev };

      keys.slice(0, -1).reduce((acc, curr) => {
        if (!acc[curr]) {
          acc[curr] = {};
        }
        return acc[curr];
      }, updatedFormData)[keys[keys.length - 1]] = value;

      return updatedFormData;
    });
  };

  const getQuestionByIndex = (pageIndex: number, questionIndex:number): Question | undefined => {
    return formData.survey.pages[pageIndex].elements[questionIndex];
  }

  const updateQuestionOrder = (pageIndex: number, questionIndex: number, direction: 'up' | 'down') => {
    setFormData(prev => {
      const survey = { ...prev.survey }; // Create a new survey object
      const pages = [...survey.pages]; // Create a new pages array
      const elements = [...pages[pageIndex].elements]; // Create a new elements array

      if (elements.length === 0 || questionIndex < 0 || questionIndex >= elements.length) {
        return prev; // No changes if index is out of bounds
      }

      const [movedItem] = elements.splice(questionIndex, 1);

      if (direction === 'down') {
        if (questionIndex < elements.length) {
          elements.splice(questionIndex + 1, 0, movedItem);
        } else {
          return prev; // No change if already at the bottom
        }
      } else if (direction === 'up') {
        if (questionIndex > 0) {
          elements.splice(questionIndex - 1, 0, movedItem);
        } else {
          return prev; // No change if already at the top
        }
      }

      // Update the page's elements with the new order
      pages[pageIndex] = { ...pages[pageIndex], elements };
      survey.pages = pages; // Update pages in the survey object

      // Return the updated state
      return { ...prev, survey };
    });
  };

  const addQuestionToPage = (
    pageIndex: number,
    question: Question
  ): void => {
    // Ensure the page exists
    if (pageIndex >= 0 && pageIndex < formData.survey.pages.length) {
      const page = formData.survey.pages[pageIndex];

      // Ensure the 'elements' array exists on the page
      if (!page.elements) {
        page.elements = [];
      }

      // Add the question to the elements array
      page.elements.push(question);
      updateFormData(`survey.pages[${pageIndex}].elements`, page.elements || {});

      // Optionally log the result to verify
      console.log(`Questão adicionada para a pagina ${pageIndex}:`, question);
    } else {
      console.error('Indice de página inválido', pageIndex);
    }
  }

  return (
    <FormContext.Provider value={{ formData, updateFormData, updateQuestionOrder, getQuestionByIndex, addQuestionToPage }}>
      {children}
    </FormContext.Provider>
  );
};
