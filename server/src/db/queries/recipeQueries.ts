import { QueryConfig } from "pg";

export function selectAllRecipesByUserId(id: number): QueryConfig {
  return {
    text: `SELECT * FROM recipes WHERE "author_id" = $1`,
    values: [id],
  };
}

export function createRecipe(
  title: string,
  ingredients: string[],
  instructions: string[],
  author_id: number,
): QueryConfig {
  return {
    text: `
        INSERT INTO recipes (title, ingredients, instructions, author_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, ingredients, instructions, author_id, created_at;
      `,
    values: [title, ingredients, instructions, author_id],
  };
}

export function selectRecipeById(
  recipeId: number,
  userId: number,
): QueryConfig {
  return {
    text: `
      SELECT * FROM recipes WHERE "id" = $1 AND "author_id" = $2
    `,
    values: [recipeId, userId],
  };
}
