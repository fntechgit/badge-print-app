
import { START_LOADING, STOP_LOADING } from "openstack-uicore-foundation/lib/actions";
import {REQUEST_BADGE, BADGE_RECEIVED, BADGE_PRINTED} from "../actions/base-actions";


const DEFAULT_STATE = {
    badge: null,
    loading: 0,
}

const baseReducer = (state = DEFAULT_STATE, action) => {
    const { type, payload } = action

    switch(type){
        case START_LOADING:
            return {...state, loading: 1};
        break;
        case STOP_LOADING:
            return {...state, loading: 0};
        break;
        case REQUEST_BADGE: {

            return state
        }
        break;
        case BADGE_RECEIVED: {

            return state
        }
        break;
        case BADGE_PRINTED: {

            return state
        }
        break;
        default:
            return state;
        break;
    }
}

export default baseReducer
