import ingredientsReducer, {
  fetchIngredients,
  clearIngredients,
} from '../ingredientsSlice';
import type { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: 'img',
    image_mobile: 'img',
    image_large: 'img',
  },
];

const initialState = { items: [], loading: false, error: null };

describe('ingredients reducer', () => {
  it('возвращает начальное состояние при неизвестном экшене и undefined', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  it('fetchIngredients.pending — включает загрузку', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.pending.type,
    });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchIngredients.fulfilled — сохраняет данные', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    });
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  it('fetchIngredients.rejected — сохраняет ошибку', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.rejected.type,
      payload: 'Ошибка загрузки',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });

  it('clearIngredients — очищает список и ошибку', () => {
    const stateWithData = {
      items: mockIngredients,
      loading: false,
      error: 'что-то',
    };
    const state = ingredientsReducer(stateWithData, clearIngredients());
    expect(state.items).toEqual([]);
    expect(state.error).toBeNull();
  });
});