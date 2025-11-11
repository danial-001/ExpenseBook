import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  incomes: [],
  loading: false,
  error: null,
};

const incomeSlice = createSlice({
  name: 'incomes',
  initialState,
  reducers: {
    setIncomes: (state, action) => {
      state.incomes = action.payload;
      state.loading = false;
      state.error = null;
    },
    addIncome: (state, action) => {
      state.incomes.unshift(action.payload);
    },
    updateIncome: (state, action) => {
      const index = state.incomes.findIndex(inc => inc.id === action.payload.id);
      if (index !== -1) {
        state.incomes[index] = action.payload;
      }
    },
    deleteIncome: (state, action) => {
      state.incomes = state.incomes.filter(inc => inc.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setIncomes, addIncome, updateIncome, deleteIncome, setLoading, setError } = incomeSlice.actions;
export default incomeSlice.reducer;
