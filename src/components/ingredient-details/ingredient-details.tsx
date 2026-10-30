import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);
  const ingredient = ingredients.find((ing) => ing._id === id);

  if (!ingredient) return <Preloader />;

  return <IngredientDetailsUI ingredientData={ingredient} />;
};