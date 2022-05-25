import { combineReducers } from "redux";
import actualTokenReducer from "./actualTokenReducer";
import forceRefresh from "./forceRefresh";
import loginStatusReducer from "./loginStatusReducer";

const allReducers = combineReducers({
  forceRefresh: forceRefresh,
  loginStatus: loginStatusReducer,
  actualToken: actualTokenReducer,
});
export default allReducers;
