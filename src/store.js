import { createStore, applyMiddleware, compose } from 'redux';
import baseReducer from './reducers/base-reducer'
import { loggedUserReducer } from "openstack-uicore-foundation/lib/reducers";
import thunk from 'redux-thunk';
import {persistCombineReducers, persistStore} from "redux-persist";
import storage from "redux-persist/es/storage";

const config = {
    key: 'root',
    storage,
}

const reducers = persistCombineReducers(config, {
    loggedUserState: loggedUserReducer,
    baseState: baseReducer
});


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

const onRehydrateComplete = () => {
    // repopulate access token on global access variable
    window.idToken = store.getState().loggedUserState.idToken;
    window.sessionState = store.getState().loggedUserState.sessionState;
}

export const persistor = persistStore(store, null, onRehydrateComplete);
export default store;
