export interface ITopicResponse {
  createdAt: string;
  updatedAt: string;
  id: number;
  typeCategoryName: string;
  timeType: string;
  title: string;
  description: string | null;
  isDraft: boolean;
  expirationTime: number;
  questions: [];
}
