import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import expenseReducer from './expenseSlice';
import incomeReducer from './incomeSlice';
import themeReducer from './themeSlice';
import savingsReducer from './savingsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    expenses: expenseReducer,
    incomes: incomeReducer,
    theme: themeReducer,
    savings: savingsReducer,
  },
});
