import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from './slices/constructorSlice';
import feedsReducer from './slices/feedsSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feeds: feedsReducer,
  user: userReducer,
});
