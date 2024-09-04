import { createNextState, createSlice } from "@reduxjs/toolkit";

export interface UserInfoState {
  [key: string]: string | number | boolean | Array<string>;
  createTime: number;
  email: string;
  headPic: string;
  id: number;
  isAdmin: boolean;
  isFrozen: boolean;
  nickName: string;
  permissions: Array<string>;
  phoneNumber: string;
  roles: Array<string>;
  username: string;
}

const initialState: UserInfoState = {
  createTime: 0,
  email: "",
  headPic: "",
  id: 0,
  isAdmin: true,
  isFrozen: false,
  nickName: "",
  permissions: [],
  phoneNumber: "",
  roles: [],
  username: "",
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state = Object.assign(state, action.payload);
    },
    setUserInfoValue: (state, action) => {
      const key = action.payload.key;
      state[key] = action.payload.value;
    },
  },
});

export const { setUserInfo, setUserInfoValue } = userInfoSlice.actions;

export default userInfoSlice.reducer;
