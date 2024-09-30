import { IRecipe } from "../models";

export const getRecipesByUserIdInteractor = async (
  getRecipesByUserIdPersistance: (userId: number) => Promise<IRecipe[]>,
  userId: number,
): Promise<IRecipe[]> => await getRecipesByUserIdPersistance(userId);
