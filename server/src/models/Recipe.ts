export interface IRecipe {
  RecipeID: number;
  Title: string;
  Ingredients: string;
  Instructions: string;
  AuthorID?: number;
  CreatedAt?: Date;
}
