import { createStore, applyMiddleware, combineReducers} from 'redux';
import baseReducer from './reducers/base-reducer'
import thunk from 'redux-thunk';


const reducers = combineReducers({
    baseState: baseReducer,
});


const store = createStore(reducers, applyMiddleware(thunk));


export default store;
