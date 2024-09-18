export interface IRecipe {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string[];
  author_id: number;
  created_at: Date;
}
