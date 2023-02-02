import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const POST_URL = 'https://jsonplaceholder.typicode.com/users';

const initialState = [];

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  try {
    const res = await axios.get(POST_URL);
    return res.data;
  } catch (error) {
    return error;
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const allUsers = state => state.users;

export const {} = usersSlice.actions;

export default usersSlice.reducer;
