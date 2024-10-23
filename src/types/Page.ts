// src/types/Page.ts
import { Question } from './Question';

// Define a Page that contains multiple elements (questions)
export interface Page {
  name?: string; // Optional name for the page
  title: string;
  elements: Question[]; // Array of elements (questions) on the page
}
