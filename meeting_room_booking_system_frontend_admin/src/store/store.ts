import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer, { UserInfoState } from "./userInfoSlice";

export interface StateType {
  userInfo: UserInfoState;
}

export default configureStore({
  reducer: {
    userInfo: userInfoReducer,
  },
});
