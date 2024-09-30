import { getRecipesByUserIdPersistance } from "../persistance";
import { IRecipe } from "../models";

export const getRecipesByUserIdInteractor = async (
  userId: number,
): Promise<IRecipe[]> => await getRecipesByUserIdPersistance(userId);
