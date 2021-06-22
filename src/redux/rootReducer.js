import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { userReducer } from "./reducer/userReducer";
import { productReducer } from "./reducer/productReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "product"],
};

const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
});

export default persistReducer(persistConfig, rootReducer);
