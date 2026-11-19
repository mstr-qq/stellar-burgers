import constructorReducer, {
  addIngredient, removeIngredient, moveIngredient, clearConstructor,
} from '../constructorSlice';
import type { TIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-1', name: 'Булка', type: 'bun', proteins: 1, fat: 1,
  carbohydrates: 1, calories: 100, price: 100,
  image: 'img', image_mobile: 'img', image_large: 'img',
};
const main: TIngredient = {
  _id: 'main-1', name: 'Котлета', type: 'main', proteins: 2, fat: 2,
  carbohydrates: 2, calories: 200, price: 200,
  image: 'img', image_mobile: 'img', image_large: 'img',
};

const initialState = { bun: null, ingredients: [] };

describe('burgerConstructor reducer', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('addIngredient — добавление булки в отдельное поле bun', () => {
    const state = constructorReducer(initialState, addIngredient(bun));
    expect(state.bun).toMatchObject(bun);
    expect(state.bun).toHaveProperty('id');
    expect(state.ingredients).toHaveLength(0);
  });

  it('addIngredient — добавление начинки в массив ingredients', () => {
    const state = constructorReducer(initialState, addIngredient(main));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(main);
    expect(state.ingredients[0]).toHaveProperty('id');
  });

  it('removeIngredient — удаление по id', () => {
    let state = constructorReducer(initialState, addIngredient(main));
    const idToRemove = state.ingredients[0].id;
    state = constructorReducer(state, removeIngredient(idToRemove));
    expect(state.ingredients).toHaveLength(0);
  });

  it('moveIngredient — меняет порядок элементов', () => {
    let state = constructorReducer(initialState, addIngredient(main));
    state = constructorReducer(state, addIngredient({ ...main, _id: 'main-2' }));
    const beforeIds = state.ingredients.map(i => i._id);
    
    state = constructorReducer(state, moveIngredient({ fromIndex: 0, toIndex: 1 }));
    
    const afterIds = state.ingredients.map(i => i._id);
    expect(afterIds).toEqual([beforeIds[1], beforeIds[0]]);
  });

  it('clearConstructor — сбрасывает состояние', () => {
    let state = constructorReducer(initialState, addIngredient(bun));
    state = constructorReducer(state, addIngredient(main));
    state = constructorReducer(state, clearConstructor());
    expect(state).toEqual(initialState);
  });
});