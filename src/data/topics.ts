import rawTopics from './topics.json';
import type { Topic } from '../types/topic';

export const topics = rawTopics as unknown as Topic[];

export function getTopic(id: string): Topic | undefined {
  return topics.find((topic) => topic.id === id);
}
