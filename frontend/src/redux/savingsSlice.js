import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  summary: {
    all_time: {
      total_deposits: 0,
      total_withdrawals: 0,
      balance: 0,
    },
    current_month: {
      total_deposits: 0,
      total_withdrawals: 0,
      balance: 0,
      label: '',
    },
  },
  transactions: [],
  loading: false,
  error: null,
};

const savingsSlice = createSlice({
  name: 'savings',
  initialState,
  reducers: {
    setSavingsSummary: (state, action) => {
      state.summary = action.payload.summary;
      state.transactions = action.payload.transactions;
      state.loading = false;
      state.error = null;
    },
    addSavingsTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
    },
    setSavingsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSavingsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setSavingsSummary,
  addSavingsTransaction,
  setSavingsLoading,
  setSavingsError,
} = savingsSlice.actions;

export default savingsSlice.reducer;
