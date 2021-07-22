import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { userReducer } from "./reducer/userReducer";
import { productReducer } from "./reducer/productReducer";
import { productsReducer } from "./reducer/productsReducer";
import { queryReducer } from "./reducer/queryReducer";
import { sideBarReducer } from "./reducer/sideBarReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "product"],
};

const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  products: productsReducer,
  query: queryReducer,
  sideBar: sideBarReducer,
});

export default persistReducer(persistConfig, rootReducer);
