import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { userReducer } from "./reducer/userReducer";
import { productReducer } from "./reducer/productReducer";
import { productsReducer } from "./reducer/productsReducer";
import { queryReducer } from "./reducer/queryReducer";
import { sideBarReducer } from "./reducer/sideBarReducer";
import { pageReducer } from "./reducer/pageReducer";
import { cartReducer } from "./reducer/cartReducer";
import { cartDrawerReducer } from "./reducer/cartDrawerReducer";
import { addressDialogReducer } from "./reducer/addressDialogReducer";
import { addressReducer } from "./reducer/addressReducer";
import { checkoutPageAccordionReducer } from "./reducer/checkoutPageAccordionReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "product", "cart"],
};

const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  products: productsReducer,
  query: queryReducer,
  sideBar: sideBarReducer,
  page: pageReducer,
  cart: cartReducer,
  cartDrawer: cartDrawerReducer,
  addressDialog: addressDialogReducer,
  address: addressReducer,
  checkoutAccordion: checkoutPageAccordionReducer,
});

export default persistReducer(persistConfig, rootReducer);
