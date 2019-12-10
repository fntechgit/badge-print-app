
import { START_LOADING, STOP_LOADING } from "openstack-uicore-foundation/lib/actions";
import {REQUEST_BADGE, BADGE_RECEIVED, BADGE_PRINTED, CLEAR_BADGE, UPDATE_SIZE} from "../actions/base-actions";


const DEFAULT_STATE = {
    badge: null,
    sizes: [
        {value: "40x60", label: '4" by 6"'},
        {value: "40x50", label: '4" by 5"'},
        {value: "35x55", label: '3.5" by 5.5"'}
    ],
    size: "40x60",
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
            let badge = {...payload.response};
            return {...state, badge: badge};
        }
        break;
        case BADGE_PRINTED: {

            return state
        }
        break;
        case CLEAR_BADGE: {
            return {...state, badge: null};
        }
        break;
        case UPDATE_SIZE: {
            let {size} = payload;
            return {...state, size };
        }
        break;
        default:
            return state;
        break;
    }
}

export default baseReducer
