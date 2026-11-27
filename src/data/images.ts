import rawImages from './legacy-images.json';
import type { ImageBank } from '../types/question';

export const questionImages = rawImages as unknown as ImageBank;

export function getQuestionImage(key: string | null): string | string[] | undefined {
  return key ? questionImages[key] : undefined;
}
