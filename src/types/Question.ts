// src/types/Question.ts

// Define a type for the possible question types in SurveyJS
export type QuestionType = 'text' | 'checkbox' | 'radiogroup' | 'dropdown' | 'rating' | 'comment';

// Define a base structure for a Question
export interface QuestionBase {
  name: string;
  title: string;
  type: QuestionType;
  isRequired?: boolean;
}

// Extend the QuestionBase type with specific properties for choice-based questions
export interface ChoiceQuestion extends QuestionBase {
  type: 'checkbox' | 'radiogroup' | 'dropdown';
  choices: string[]; // Choices for multiple-choice questions
}
// Define a Text Question (e.g., text input)
export interface TextQuestion extends QuestionBase {
  type: 'text';
  placeHolder?: string; // Optional placeholder for text questions
}

// Define a Rating Question
export interface RatingQuestion extends QuestionBase {
  type: 'rating';
  rateMax?: number;  // Max rating value (default: 5)
  rateMin?: number;  // Min rating value (default: 1)
  rateStep?: number; // Increment steps (default: 1)
}
// Union type to represent any type of question
export type Question = TextQuestion | ChoiceQuestion | RatingQuestion;
