import { Page } from './Page';

export interface SurveySchema {
  title: string;
  description?: string;
  pages: Page[]; // An array of questions in the survey
}
