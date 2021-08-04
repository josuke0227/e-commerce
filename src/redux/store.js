import { persistStore } from "redux-persist";
import rootReducer from "./rootReducer";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(rootReducer, composeWithDevTools());

const persister = persistStore(store);

export { store, persister };
