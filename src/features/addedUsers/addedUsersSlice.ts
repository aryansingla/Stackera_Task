import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NewUser = {
  id: string;
  name: string;
  email: string;
  company?: { name: string };
  address?: { city: string };
};

type State = {
  users: NewUser[];
};

const initialState: State = {
  users: [],
};

const slice = createSlice({
  name: "addedUsers",
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<NewUser>) {
      state.users.push(action.payload);
    },
    clearUsers(state) {
      state.users = [];
    },
  },
});

export const { addUser, clearUsers } = slice.actions;
export default slice.reducer;
