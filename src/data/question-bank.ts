import rawQuestions from './legacy-questions.json';
import type { Question } from '../types/question';

const allLegacyQuestions = rawQuestions as unknown as Question[];

export const generalQuestions: Question[] = allLegacyQuestions.filter(
  (question) => question.t !== 'by',
);

/** Legacy state-specific bank, retained under the original question IDs B1–B10. */
export const bavariaQuestions: Question[] = allLegacyQuestions.filter(
  (question) => question.t === 'by',
);

export const allLegacyQuestionsForMigration: Question[] = allLegacyQuestions;

export function getQuestionById(id: string | number): Question | undefined {
  return allLegacyQuestions.find((question) => String(question.n) === String(id));
}
