import { persistStore } from "redux-persist";
import rootReducer from "./rootReducer";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(rootReducer, composeWithDevTools());

const persistor = persistStore(store);

export { store, persistor };
