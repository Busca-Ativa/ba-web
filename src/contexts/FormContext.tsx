import React, { createContext, useState, ReactNode } from 'react';
import { Question } from "@/types/Question";
import { SurveySchema } from "@/types/Survey";

interface FormData {
  name: string;
  description: string;
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
  tags: [],
  survey: {
    title: "",
    description: "",
    pages: []
  }
};



// Create the context with default values (which will be overridden by the provider)
export const FormContext = createContext<FormContextType | undefined>(undefined);

// Define the provider props
interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider = ({ children }: FormProviderProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
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

  return (
    <FormContext.Provider value={{ formData, updateFormData, updateQuestionOrder, getQuestionByIndex }}>
      {children}
    </FormContext.Provider>
  );
};
